# Deep Dive: `refreshSession()` and Multi-Tab Token Rotation in Rock Dashboard

> **File Location**: [`src/API.tsx`](file:///F:/Mazen/Rock/Rock-dashboard/src/API.tsx#L45-L66)  
> *(Note: This function lives inside `src/API.tsx`, which serves as the foundational HTTP layer powering `src/App.tsx`, `AuthContext.tsx`, and all dashboard API communications).*

---

## 1. What Does This Function Do?

Here is the exact code of the function:

```typescript
async function refreshSession() {
  const refresh = async () => {
    const response = await api.post<ApiResponse<User>>("/Auth/Refresh", undefined, {
      skipAuthRefresh: true,
    });
    if (!response.data.isSuccess) throw new Error("Unable to refresh your session.");
  };

  // A different tab may have rotated the shared cookie while this tab waited.
  if (typeof navigator !== "undefined" && navigator.locks) {
    await navigator.locks.request(`rock-auth-refresh:${API_URL}`, async () => {
      try {
        await api.get("/Auth/UserInfo", { skipAuthRefresh: true });
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error;
        await refresh();
      }
    });
  } else {
    await refresh();
  }
}
```

### Line-by-Line Breakdown:

1. **`const refresh = async () => { ... }`**:
   An internal helper function that performs the actual network call to `POST /api/Auth/Refresh`.
   - `{ skipAuthRefresh: true }`: A custom Axios configuration flag. It informs the response interceptor: *"If this request fails with a 401, do not try to refresh again!"* This prevents an infinite retry loop.
   - It checks `if (!response.data.isSuccess) throw new Error(...)` to ensure that backend logical failures are treated as exceptions.
   - When this endpoint succeeds, the ASP.NET Core backend issues fresh `HttpOnly; Secure; SameSite=None` cookies (`accessToken` and `refreshToken`).

2. **`if (typeof navigator !== "undefined" && navigator.locks)` (Cross-Tab Mutex)**:
   - Uses the browser's native **Web Locks API** (`navigator.locks`).
   - Requests an exclusive lock named `rock-auth-refresh:${API_URL}`.
   - If Tab 1 is already refreshing, Tab 2 and Tab 3 will pause and wait in line asynchronously instead of firing duplicate refresh requests.

3. **`await api.get("/Auth/UserInfo", { skipAuthRefresh: true })` (The Double-Check Guard)**:
   - Once a waiting tab finally acquires the lock, it does not immediately call `/Auth/Refresh`.
   - Instead, it first probes `GET /Auth/UserInfo`.
   - **Why?** Because cookies are shared across all tabs on the same domain. If Tab 1 already completed the refresh while Tab 2 was waiting for the lock, the browser already has the updated `accessToken` cookie.
   - If `GET /Auth/UserInfo` succeeds (HTTP 200), Tab 2 knows the session is already valid. It exits without doing anything further!

4. **`catch (error)` & Fallback**:
   - If `GET /Auth/UserInfo` fails with a `401 Unauthorized`, it confirms that the cookies are indeed still expired. Only then does it call `await refresh()`.
   - If `navigator.locks` is not supported (such as in legacy browsers or automated test environments), it falls back directly to `await refresh()`.

---

## 2. What Problem Does This Function Solve?

This function solves the classic **Refresh Token Rotation Race Condition** (also known as the **Multi-Tab Token Reuse Trap**).

### The Technical Context:
The backend (`Rock_back-end`) uses **Refresh Token Rotation**:
- Every refresh token is **single-use**.
- When you use a refresh token at `/Auth/Refresh`, the backend invalidates it immediately and issues a brand-new refresh token.
- If a client attempts to use an *already invalidated* refresh token, the backend detects this as a **Token Theft / Replay Attack** and immediately revokes all sessions for that user.

### The Problem in Multi-Tab Browsing:
Imagine a user has 3 tabs open:
- Tab 1: Products
- Tab 2: Orders
- Tab 3: Stock Management

The user leaves their desk for 20 minutes (the access token expires after 15 minutes). When they return, all 3 tabs trigger network requests at the same moment:

```
[Tab 1] GET /Products  ──> 401 Unauthorized
[Tab 2] GET /Orders    ──> 401 Unauthorized
[Tab 3] GET /Stock     ──> 401 Unauthorized
```

#### Without `refreshSession` (The Race Condition):
1. All 3 tabs simultaneously send `POST /Auth/Refresh` with the same cookie.
2. Tab 1's request reaches the backend first: the backend validates the token, marks it used, and returns new cookies.
3. Tab 2 and Tab 3's requests reach the backend 10ms later: they carry the old refresh token that Tab 1 just invalidated!
4. The backend sees an already-used token, flags a security violation, invalidates the entire user session, and returns a 401 error.
5. Tab 2 & 3 trigger `logoutCallback()`, and the user is unexpectedly kicked out to the Login screen.

#### With `refreshSession()` (The Solution):
1. All 3 tabs request the Web Lock `rock-auth-refresh:${API_URL}`.
2. Tab 1 gets the lock first; Tab 2 and Tab 3 wait.
3. Tab 1 probes `/Auth/UserInfo` (401), runs `refresh()`, and receives new cookies. Tab 1 releases the lock.
4. Tab 2 acquires the lock, probes `/Auth/UserInfo`, and gets **HTTP 200 OK** because Tab 1's new cookies are already active. Tab 2 skips refreshing.
5. Tab 3 acquires the lock, probes `/Auth/UserInfo`, gets **HTTP 200 OK**, and skips refreshing.
6. All 3 tabs replay their original requests seamlessly. Zero logouts, zero errors!

---

## 3. Why Is This Function Useful in the Project?

1. **Seamless User Experience**:
   Users can keep multiple dashboard tabs open simultaneously without experiencing sudden, random logouts.

2. **Compatibility with `HttpOnly` Cookies**:
   Since `accessToken` and `refreshToken` are stored in `HttpOnly` cookies, JavaScript cannot read the token's expiration date from `document.cookie`. JavaScript cannot know whether another tab updated the cookie in the background without probing the server. The probe to `/Auth/UserInfo` provides a lightweight check.

3. **Protection against "Thundering Herd" Requests**:
   In complex pages like `Overview.tsx` or `AdminLayout`, mounting the view triggers 5–8 simultaneous API requests (orders, categories, products, colors, user profile). `refreshSession()` coordinates with `refreshPromise` in `src/API.tsx` so that all 8 requests wait on a single shared refresh operation instead of firing 8 separate refresh calls.

4. **Resilience & Non-Destructive Error Handling**:
   If the network drops (e.g. WiFi hiccup) or the server returns a 500 error, non-401 errors are rejected without wiping the user's session credentials. The session is only cleared when a confirmed `401 Unauthorized` indicates that the refresh token is truly expired or revoked.

---

## 4. In the Old Version of `src/API.tsx`, What Was the "Leak" Without This Function?

In the previous version of `src/API.tsx`:

```typescript
// OLD IMPLEMENTATION:
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const isRefreshEndpoint = config.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !isRefreshEndpoint) {
      if (!config._retry) {
        config._retry = true;

        try {
          await axiosInstance.post('/auth/refresh');
          return axiosInstance(config);
        } catch (refreshError) {
          if (logoutCallback) {
            logoutCallback();
          }
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### The Critical Flaws and "Leaks" in the Old Version:

1. **Parallel Refresh Request Leak (No `refreshPromise`)**:
   - The old interceptor had **no shared promise** (`refreshPromise`).
   - If 5 requests fired on page load and all 5 received a 401, each request entered `if (!config._retry)` independently and called `await axiosInstance.post('/auth/refresh')`.
   - 5 parallel refresh requests were sent to the server simultaneously. The first one invalidated the refresh token; the remaining 4 failed, caught the error, called `logoutCallback()`, and prematurely logged the user out.

2. **Cross-Tab Concurrency Leak (No Web Locks)**:
   - There was no cross-tab coordination. Opening multiple tabs or refreshing two tabs at once guaranteed token rotation failure and forced logouts.

3. **Session Version Leak (Ghost Request Replay)**:
   - The old version had no `sessionVersion` tracking. If User A logged out and User B logged in while an old request was still pending, the old request would refresh and replay using User B's credentials.
   - The new implementation uses `sessionVersion` to discard any response belonging to an older signed-in session.

4. **Post-Logout Cookie Resurrection Leak**:
   - In the old version, if a background refresh was in-flight when the user clicked **Logout**, the logout endpoint would clear the cookies, but milliseconds later the in-flight refresh would finish and write *new* cookies back to the browser, accidentally reviving the session.
   - The new version provides `waitForAuthRefresh()`, which ensures all pending refreshes settle before the logout request executes.

5. **Infinite Loop Risk on Casing / Sub-paths**:
   - The old code checked `config.url?.includes('/auth/refresh')`. If the backend URL had different casing (such as `/Auth/Refresh` or query parameters), the check could fail.
   - The new version uses `{ skipAuthRefresh: true }` metadata directly on the Axios config object, which is immune to URL casing differences.
