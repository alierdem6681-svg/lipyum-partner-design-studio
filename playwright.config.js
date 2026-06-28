import { defineConfig } from "@playwright/test";

const nodeBin = process.platform === "win32"
  ? "node_modules\\node\\bin\\node.exe"
  : "node_modules/node/bin/node";
const port = process.env.PLAYWRIGHT_PORT || "5174";
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL || "";
const baseURL = externalBaseURL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  ...(externalBaseURL ? {} : {
    webServer: {
      command: `${nodeBin} node_modules/vite/bin/vite.js --host 0.0.0.0 --port ${port} --strictPort`,
      url: baseURL,
      reuseExistingServer: false,
      timeout: 60_000,
    },
  }),
  projects: [
    {
      name: "chromium-mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 393, height: 852 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      },
    },
  ],
});
