/**
 * PLAYWRIGHT CONFIGURATION FILE
 *
 * This is the main settings file for Playwright.
 * It reads the BASE_URL from .env file so you don't hardcode URLs.
 *
 * COMPARISON WITH SELENIUM:
 * Selenium  → config.properties + WebDriverManager
 * Playwright → .env + playwright.config.ts (this file does both jobs)
 */

import { defineConfig, devices } from '@playwright/test';

// Load .env file → makes process.env.BASE_URL, process.env.LOGIN_EMAIL etc. available
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Where to find test files
  testDir: './tests',

  // Run tests in parallel for speed
  fullyParallel: true,

  // Fail CI build if you accidentally left test.only in code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI (0 retries locally)
  retries: process.env.CI ? 2 : 0,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Generate HTML report after test run
  reporter: 'html',

  use: {
    // BASE_URL from .env — now page.goto('/backoffice/login') will automatically
    // prepend this URL, so you don't hardcode the full URL anywhere!
    baseURL: process.env.BASE_URL,

    // ==================== SCREENSHOT SETTINGS ====================
    // 'off'           → No screenshots (default)
    // 'on'            → Take screenshot after EVERY test (pass or fail)
    // 'only-on-failure' → Take screenshot ONLY when a test fails (recommended)
    screenshot: 'only-on-failure',

    // ==================== VIDEO SETTINGS ====================
    // 'off'              → No video (default)
    // 'on'               → Record video for EVERY test
    // 'retain-on-failure' → Record all, but DELETE videos of passed tests (recommended)
    // 'on-first-retry'   → Record video only when retrying a failed test
    video: 'retain-on-failure',

    // ==================== TRACE SETTINGS ====================
    // Trace = a detailed recording of everything (network, DOM, clicks, console logs)
    // You can open it in Playwright Trace Viewer — very powerful for debugging!
    // 'on-first-retry' → Collect trace only when retrying failed tests
    trace: 'on-first-retry',
  },

  // Which browsers to test on
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
