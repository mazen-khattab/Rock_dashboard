import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5174",
    ignoreHTTPSErrors: true,
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } }],
  webServer: {
    command: "npm run dev -- --mode test --host localhost --port 5174 --strictPort",
    env: { VITE_API_URL: "/api" },
    url: "http://localhost:5174",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
