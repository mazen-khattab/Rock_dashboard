# Dashboard authentication contract

Extracted on 2026-11-04 from `F:/Mazen/Rock/Rock_back-end` by reading source files only. No backend files were created, modified, or deleted, and the backend was not started (startup applies migrations, seeds data, and schedules jobs).

## Source files

- `API/Controllers/AuthController.cs`: routes, cookies, status codes, response construction.
- `Application/Services/AuthService.cs`: login, lockout, JWT claims, refresh rotation, logout, current-user lookup.
- `Application/DTOs/LoginDto.cs`, `UserInfoDto.cs`, `UserProfileDto.cs`: payloads.
- `Application/Responses/ApiResponse.cs`, `ApiErrorResponse.cs`: response envelopes.
- `API/Controllers/UsersController.cs`: authenticated profile lookup.
- `API/Program.cs`: authentication, CORS, Identity options, JSON configuration.
- `Core/Settings/JwtSettings.cs`: default token lifetimes.
- `Core/Enum/RoleType.cs`, `Infrastructure/DataSeeding/RoleSeeder.cs`, `AdminUserSeeder.cs`: roles and initial administrator.
- `API/Controllers/OrdersController.cs`, `CategoriesController.cs`, `ColorsController.cs`, `SizesController.cs`: dashboard role requirements.
- `API/Properties/launchSettings.json`: development addresses.

## Transport and session

Development API base URL: `https://localhost:7179/api`. The HTTP profile uses port 5213, but authentication cookies are Secure; use the HTTPS profile. Production frontend currently expects `/api`; `VITE_API_URL` can override this at build time.

Send requests with credentials. The backend sets `accessToken` and `refreshToken` cookies, both `HttpOnly`, `Secure`, `SameSite=None`, `IsEssential=true`, with no explicit Domain or Path supplied. Tokens are not returned to browser JavaScript by the auth controller. Do not put tokens or passwords in local/session storage.

JWT authentication reads `accessToken` from cookies, validates issuer, audience, signing key and lifetime, and uses zero clock skew. JWT claims include numeric user ID serialized as a string, email, full name, and one role claim per role.

`JwtSettings` defaults to 15 minutes for access tokens and 30 days for refresh tokens. Checked-in appsettings files do not override these; external runtime configuration may override them. Secret values and administrator credentials were not extracted.

## Endpoint contracts

All paths below include the `/api` prefix. JSON property casing follows ASP.NET Core web defaults (camelCase).

| Method | Path                 | Request                                 | Success                                                                        | Failure                                                                                               |
| ------ | -------------------- | --------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| POST   | `/api/Auth/Login`    | `{ "email": "...", "password": "..." }` | 200; sets both cookies; user-info envelope                                     | 400 error envelope for invalid credentials or lockout; automatic validation may return ProblemDetails |
| GET    | `/api/Auth/UserInfo` | No body; access cookie                  | 200; user-info envelope from database                                          | 401, possibly empty authentication challenge or error envelope                                        |
| POST   | `/api/Auth/Refresh`  | No body; refresh cookie                 | 200; rotates cookies; user-info envelope                                       | 401; plain string when cookie is missing, error envelope for invalid/expired token                    |
| POST   | `/api/Auth/logout`   | No body; cookies if available           | 200; expires matching refresh token and deletes both cookies; success envelope | Unhandled failures use exception middleware                                                           |
| GET    | `/api/Users/profile` | No body; authenticated                  | 200; profile envelope                                                          | 401 challenge, or 400 error envelope for profile lookup failure                                       |

User-info example (illustrative values):

```json
{
  "isSuccess": true,
  "message": "Login successful",
  "errorType": 0,
  "data": { "userId": 1, "userName": "AB", "role": ["User", "Admin", "Owner"] }
}
```

`userId` is declared `int?`; successful authentication requires a usable numeric ID. `userName` is **initials**, calculated from the first letters of first and last names. `role` is an array of strings, not a tuple or single string. Known roles are exactly `User`, `Admin`, and `Owner`. Login/refresh share a helper that always writes `Login successful`; do not use the message to determine which operation succeeded.

Profile `data` fields: `firstName`, `lastName`, `email`, `phone`, `governorate`, `city`, `fullAddress` (all strings). The frontend needs the first three for the profile UI. Authentication remains valid if a non-authentication profile lookup fails; initials/roles are available as fallback.

Logout success contains `isSuccess: true`, `message: "Logged out successfully"`, `errorType: 0`, and `data: null`. Logout does not require an access token and clears cookies even when the refresh cookie is absent. A failed network logout cannot clear HTTP-only cookies, so the frontend must retain the current session and offer retry rather than falsely report successful logout.

Errors can contain `isSuccess`, `statusCode`, `message`, `path`, `method`, `traceId`, optional `details` and `innerException`. Automatic model validation may instead return `title`, `status`, `errors`, and `traceId`. Authentication/authorization challenges may have no body. Show useful safe messages and handle all these shapes.

## Authorization and login validation

Allow dashboard access to a user with `Admin` **or** `Owner`, matching protected order endpoints and category/color/size creation endpoints. `User` alone has no dashboard access. Preserve the backend's exact role casing. The seeded administrator is assigned all three roles; do not assume other users have all three.

The login DTO has no password-length validation. The Identity configuration sets required registration password length to 4 and requires a special character (other Identity defaults still apply); login should only require a nonempty password rather than enforce registration policy. Lockout is configured for five failed attempts and ten minutes. Failed logins return HTTP 400 with backend messages, including account lockout.

Registration and `POST /api/Auth/assign-role` exist but are outside this login-only feature. Assign-role requires `Admin` specifically. The Users listing uses mock data and is not an authentication endpoint.

## Refresh behavior

Every new refresh token expires all previous refresh tokens for the user. Refresh expires the supplied token and creates another. This means concurrent refresh requests must share one in-flight operation within a frontend instance; cross-tab refresh is serialized with Web Locks where supported. A second device/browser login can invalidate the first session's refresh token. Existing access JWTs can remain valid until their expiry.

On a protected request's 401, refresh once and retry once. Never automatically refresh Login, Refresh, or logout requests, and never refresh on 403. Missing/invalid refresh credentials end the local session; transport errors and server failures should remain retryable errors rather than be treated as confirmed logout.

## CORS and deployment

The `FrontEndPolicy` allows credentials, any method and any header for exactly:

- `http://localhost:5173`
- `http://localhost:5174`
- `https://rockstore-weld.vercel.app`
- `https://keef-wear.com`

Use `localhost`, not `127.0.0.1`, for browser development. The HTTPS development certificate must be trusted. A separately hosted production dashboard must have an allowed origin or use a same-origin API proxy. Browser restrictions on third-party cookies may affect unrelated frontend/API sites.

## Backend limitations observed (not modified)

1. `GenerateCookies` assigns the same CookieOptions instance to both cookie variables and changes its expiry twice before appending either cookie. Both cookies therefore receive the refresh expiry, although the access JWT still expires according to its own lifetime.
2. No explicit antiforgery middleware, CSRF token contract, or request-origin validation was found in the inspected API authentication pipeline. With SameSite=None cookies, CSRF protection needs backend review before production; this frontend does not invent a token endpoint.
3. Some product admin routes do not declare authorization attributes. Frontend route guards cannot replace backend authorization.
4. Refresh invalidation mixes DateTime.UtcNow and DateTime.Now comparisons. Actual behavior depends on server/database timezone handling.
5. User initials assume first and last names are nonempty; malformed stored names can cause backend exceptions.

## Frontend implementation

- Add typed auth service and context using the existing service/context conventions.
- Initialize with UserInfo, refreshing expired access credentials when needed; load profile data separately.
- Guard the `/admin` parent route and mount domain providers within the authorized layout so their cached data is discarded on logout/session changes.
- Redirect signed-in dashboard users away from Login; retain safe internal dashboard destinations after sign-in.
- Replace mock login/default credentials and static profile identity; wire logout from all dashboard pages.
- Keep startup transport failures retryable and show an access-denied screen for signed-in non-admin users.
- Validate using a production build, relevant lint checks, and mocked authentication behavior tests. Live end-to-end verification still requires a running configured backend and an authorized account; do not start it as part of this source-only backend inspection.

## Implemented files

- `src/Services/AuthService.ts`: typed login, current-user, profile, logout, error handling.
- `src/Context/AuthContext.tsx`, `src/Context/useAuth.ts`: session state, startup checks, profile loading, login/logout actions, stale-response protection.
- `src/API.tsx`, `src/Types/axios.d.ts`: credentialed requests, shared refresh, cross-tab refresh locking where supported, bounded retries, session invalidation callback.
- `src/Components/Auth/RequireAuth.tsx`, `SessionBoundary.tsx`, `LogoutButton.tsx`: authorization, startup/retry UI, reusable logout.
- `src/Components/Auth/Login.tsx`: real login with empty initial fields and backend-compatible password validation.
- `src/App.tsx`, `src/main.tsx`: provider placement, guarded nested routes, session-aware redirects, dashboard cache lifetime.
- `src/Helper/AuthRedirect.ts`: safe return destinations inside `/admin`.
- `src/Components/Overview/Overview.tsx`, `src/Components/Sidebar/Sidebar.tsx`: actual account identity and working logout from desktop/mobile navigation.
- `.env.example`: optional `VITE_API_URL` override.
- `tests/browser/auth.spec.ts`, `playwright.config.ts`, `vite.config.ts`: reproducible browser checks with a mocked API contract, an isolated API base URL, and hot reload disabled in test mode.

## Verification and local use

Verified after implementation:

- `npm run build`: passed.
- `npm run test:browser`: 19 tests passed in installed Google Chrome. Tests intercept all API requests; the real backend is never contacted or started. Coverage includes deep-link login, empty initial credentials, short valid passwords, startup restoration, actual profile/fallback, Admin/Owner access, regular-user denial, safe redirects, no local credential storage, login/lockout errors, parallel and cross-tab refresh, refresh rejection/retry, 403 handling, nested-page logout, failed logout retry, and logout during refresh.
- ESLint on all changed source/config/test files: passed.
- `git diff --check`: passed.
- Repository-wide `npm run lint`: reports 30 pre-existing errors in unchanged order/stock components, domain contexts, and domain services. These are outside this auth implementation.

To use with the live API, have the configured backend available at `https://localhost:7179`, trust its HTTPS certificate, run `npm run dev`, and open its `http://localhost:5173` or `http://localhost:5174` address. Sign in with an existing backend account assigned Admin or Owner. No default or seed credentials are embedded in the frontend. For a different API host, set `VITE_API_URL` before starting/building and ensure the frontend origin is allowed by the backend. Production defaults to the same-origin `/api` path.

To rerun browser tests, install frontend dependencies with `npm install`, have Google Chrome installed, and run `npm run test:browser`. The test runner starts and stops its own frontend development server on localhost:5174; keep that port free. Live cookie behavior, externally supplied configuration, and database integration have not been verified against a running backend in this task.
