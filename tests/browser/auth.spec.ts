import { test, expect, type Page } from "@playwright/test";

// Mock the extracted contract so these tests never start or contact the backend.
async function mockAuth(page: Page, initialSession: "active" | "expired" | "signedout" = "signedout") {
  const state = {
    session: initialSession,
    roles: ["Admin"],
    loginStatus: 200,
    loginMessage: "Invalid Credentials.",
    refreshStatus: 200,
    logoutStatus: 200,
    userInfoFailure: false,
    profileFailure: false,
    protectedStatus: 200,
    refreshDelay: 0,
    refreshCalls: 0,
    loginCalls: 0,
    domainCalls: 0,
  };
  const userInfo = () => ({ isSuccess: true, message: "Login successful", errorType: 0,
    data: { userId: 42, userName: "AB", role: state.roles } });

  await page.context().route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname.toLowerCase();
    const headers = {
      "access-control-allow-origin": "http://localhost:5174",
      "access-control-allow-credentials": "true",
      "access-control-allow-headers": "content-type, x-request-id, accept-language",
      "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    };
    const reply = (status: number, data: unknown) => route.fulfill({ status, headers, json: data });
    if (route.request().method() === "OPTIONS") return reply(200, {});

    if (path.endsWith("/auth/login")) {
      state.loginCalls += 1;
      if (state.loginStatus !== 200) return reply(state.loginStatus, { isSuccess: false, message: state.loginMessage });
      expect(route.request().postDataJSON()).toEqual({ email: "admin@example.com", password: "Ab1!" });
      state.session = "active";
      return reply(200, userInfo());
    }
    if (path.endsWith("/auth/userinfo")) {
      if (state.userInfoFailure) return route.abort("failed");
      return state.session === "active" ? reply(200, userInfo()) : reply(401, "");
    }
    if (path.endsWith("/auth/refresh")) {
      state.refreshCalls += 1;
      if (state.refreshDelay) await new Promise((resolve) => setTimeout(resolve, state.refreshDelay));
      if (state.refreshStatus !== 200) return reply(state.refreshStatus, { message: "Refresh failed." });
      if (state.session === "signedout") return reply(401, "Refresh token does not exist in cookies");
      state.session = "active";
      return reply(200, userInfo());
    }
    if (path.endsWith("/auth/logout")) {
      if (state.logoutStatus !== 200) return reply(state.logoutStatus, { message: "Unable to sign out. Please try again." });
      state.session = "signedout";
      return reply(200, { isSuccess: true, message: "Logged out successfully", data: null });
    }
    if (path.endsWith("/users/profile")) {
      if (state.session !== "active") return reply(401, "");
      if (state.profileFailure) return reply(500, { message: "Profile unavailable." });
      return reply(200, { isSuccess: true, data: { firstName: "Alex", lastName: "Builder",
        email: "admin@example.com", phone: "", city: "", governorate: "", fullAddress: "" } });
    }
    state.domainCalls += 1;
    if (state.session !== "active") return reply(401, "");
    if (state.protectedStatus !== 200) return reply(state.protectedStatus, "");
    return reply(200, { items: [], totalCount: 0, totalPages: 1, pageNumber: 1, pageSize: 12 });
  });
  return state;
}

async function submitLogin(page: Page) {
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("Ab1!");
  await page.getByRole("button", { name: "Login", exact: true }).click();
}

async function requestProtectedResources(page: Page, count = 1) {
  return page.evaluate(async (requestCount) => {
    // Exercise the real client against the mocked server, including parallel 401s.
    const modulePath = "/src/API.tsx";
    const { default: api } = await import(/* @vite-ignore */ modulePath);
    return Promise.all(Array.from({ length: requestCount }, () =>
      api.get("/Orders/admin").then(() => "ok").catch(() => "error")));
  }, count);
}

test("protects deep links and signs in with the backend's shorter valid passwords", async ({ page }) => {
  const state = await mockAuth(page);
  await page.goto("/admin/orders?status=Pending#results");
  await expect(page).toHaveURL(/\/login$/);
  expect(state.domainCalls).toBe(0);
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Password", { exact: true })).toHaveValue("");
  await submitLogin(page);
  await expect(page).toHaveURL(/\/admin\/orders\?status=Pending#results$/);
  await expect(page.getByRole("heading", { name: "Orders", exact: true })).toBeVisible();
});

test("restores an existing session and displays the actual profile", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/login");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("button", { name: "Open profile menu" })).toContainText("Alex Builder");
  expect(state.refreshCalls).toBe(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Open profile menu" })).toContainText("admin@example.com");
});

test("allows the Owner role without requiring Admin", async ({ page }) => {
  const state = await mockAuth(page, "active");
  state.roles = ["Owner"];
  await page.goto("/admin");
  await expect(page.locator(".app-shell")).toBeVisible();
});

test("uses initials and roles when optional profile details cannot be loaded", async ({ page }) => {
  const state = await mockAuth(page, "active");
  state.profileFailure = true;
  await page.goto("/admin");
  await expect(page.getByRole("button", { name: "Open profile menu" })).toContainText("AB");
  await expect(page.getByRole("button", { name: "Open profile menu" })).toContainText("Admin");
  await expect(page.locator(".app-shell")).toBeVisible();
});

test("rejects external post-login destinations and does not store credentials", async ({ page }) => {
  await mockAuth(page);
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
  await page.evaluate(() => window.history.replaceState({ usr: { from: "https://example.com" }, idx: 0 }, "", "/login"));
  await page.reload();
  await submitLogin(page);
  await expect(page).toHaveURL(/\/admin$/);
  expect(await page.evaluate(() => ({ local: { ...localStorage }, session: { ...sessionStorage } })))
    .toEqual({ local: {}, session: {} });
});

test("denies regular users and lets them sign out", async ({ page }) => {
  const state = await mockAuth(page, "active");
  state.roles = ["User"];
  await page.goto("/admin/products");
  await expect(page.getByRole("heading", { name: "Access denied" })).toBeVisible();
  expect(state.domainCalls).toBe(0);
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("displays failed login messages without attempting another refresh", async ({ page }) => {
  const state = await mockAuth(page);
  state.loginStatus = 400;
  state.loginMessage = "Account locked due to multiple failed login attempts.";
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
  const refreshes = state.refreshCalls;
  await submitLogin(page);
  await expect(page.getByRole("alert")).toContainText(state.loginMessage);
  expect(state.refreshCalls).toBe(refreshes);
  expect(state.loginCalls).toBe(1);
});

test("does not refresh a 401 from the login endpoint", async ({ page }) => {
  const state = await mockAuth(page);
  state.loginStatus = 401;
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
  const refreshes = state.refreshCalls;
  await submitLogin(page);
  await expect(page.getByRole("alert")).toContainText("Invalid Credentials.");
  expect(state.refreshCalls).toBe(refreshes);
});

test("restores expired access credentials using refresh once", async ({ page }) => {
  const state = await mockAuth(page, "expired");
  await page.goto("/admin");
  await expect(page.locator(".app-shell")).toBeVisible();
  expect(state.refreshCalls).toBe(1);
});

test("shares one refresh for concurrent protected request failures", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/admin");
  await expect(page.getByRole("button", { name: "Open profile menu" })).toContainText("Alex Builder");
  state.session = "expired";
  state.refreshDelay = 150;
  expect(await requestProtectedResources(page, 3)).toEqual(["ok", "ok", "ok"]);
  expect(state.refreshCalls).toBe(1);
  await expect(page.locator(".app-shell")).toBeVisible();
});

test("serializes refresh across tabs that share the same cookies", async ({ page, context }) => {
  const state = await mockAuth(page, "active");
  const secondTab = await context.newPage();
  await Promise.all([page.goto("/admin"), secondTab.goto("/admin")]);
  for (const tab of [page, secondTab]) {
    await expect(tab.getByRole("button", { name: "Open profile menu" })).toContainText("Alex Builder");
  }
  state.session = "expired";
  state.refreshDelay = 150;
  const results = await Promise.all([requestProtectedResources(page), requestProtectedResources(secondTab)]);
  expect(results).toEqual([["ok"], ["ok"]]);
  expect(state.refreshCalls).toBe(1);
});

test("ends an expired session when refresh is rejected", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/admin");
  await expect(page.locator(".app-shell")).toBeVisible();
  state.session = "expired";
  state.refreshStatus = 401;
  await requestProtectedResources(page);
  await expect(page).toHaveURL(/\/login$/);
  expect(state.refreshCalls).toBe(1);
});

test("does not loop when a protected retry is still unauthorized", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/admin");
  await expect(page.locator(".app-shell")).toBeVisible();
  state.session = "expired";
  state.protectedStatus = 401;
  await requestProtectedResources(page);
  await expect(page).toHaveURL(/\/login$/);
  expect(state.refreshCalls).toBe(1);
});

test("keeps a forbidden response separate from authentication expiry", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/admin");
  await expect(page.locator(".app-shell")).toBeVisible();
  state.protectedStatus = 403;
  expect(await requestProtectedResources(page)).toEqual(["error"]);
  expect(state.refreshCalls).toBe(0);
  await expect(page.locator(".app-shell")).toBeVisible();
});

test("offers retry for a network failure during session initialization", async ({ page }) => {
  const state = await mockAuth(page, "active");
  state.userInfoFailure = true;
  await page.goto("/admin/products");
  await expect(page.getByRole("heading", { name: "Unable to check your session" })).toBeVisible();
  expect(state.domainCalls).toBe(0);
  state.userInfoFailure = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible();
});

test("keeps server failures during refresh retryable", async ({ page }) => {
  const state = await mockAuth(page, "expired");
  state.refreshStatus = 500;
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Unable to check your session" })).toBeVisible();
  state.refreshStatus = 200;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.locator(".app-shell")).toBeVisible();
});

test("signs out from a nested dashboard page and stays signed out after reload", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/admin/products");
  await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Logout", exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(state.session).toBe("signedout");
  await page.reload();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
});

test("retains the session when server logout fails and supports retry", async ({ page }) => {
  const state = await mockAuth(page, "active");
  state.logoutStatus = 500;
  await page.goto("/admin/products");
  await expect(page.locator(".app-shell")).toBeVisible();
  const logout = page.getByRole("button", { name: "Logout", exact: true }).filter({ visible: true });
  await logout.click();
  await expect(page.getByRole("alert")).toContainText("Unable to sign out");
  await expect(page.locator(".app-shell")).toBeVisible();
  state.logoutStatus = 200;
  await logout.click();
  await expect(page).toHaveURL(/\/login$/);
});

test("finishes cookie refresh before logout so an old response cannot restore a session", async ({ page }) => {
  const state = await mockAuth(page, "active");
  await page.goto("/admin");
  await expect(page.getByRole("button", { name: "Open profile menu" })).toContainText("Alex Builder");
  state.session = "expired";
  state.refreshDelay = 350;
  const requests = requestProtectedResources(page);
  await expect.poll(() => state.refreshCalls).toBe(1);
  await page.getByRole("button", { name: "Logout", exact: true }).filter({ visible: true }).click();
  await requests;
  await expect(page).toHaveURL(/\/login$/);
  expect(state.session).toBe("signedout");
  await page.reload();
  await expect(page.getByRole("button", { name: "Login", exact: true })).toBeVisible();
});
