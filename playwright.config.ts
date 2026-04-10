/**
 * PLAYWRIGHT CONFIGURATION FILE
 *
 * This is the main settings file for Playwright.
 * It reads the BASE_URL from .env file so you don't hardcode URLs.
 *
 * COMPARISON WITH SELENIUM:
 * Selenium  → config.properties + WebDriverManager + TestNG.xml
 * Playwright → .env + playwright.config.ts (this file does all three jobs)
 */

import { defineConfig, devices } from '@playwright/test';

// Load .env file → makes process.env.BASE_URL, process.env.LOGIN_EMAIL etc. available
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({

    // ==================== TEST DISCOVERY ====================
    // Where to find test files
    testDir: './tests',

    // Run tests in parallel for speed
    fullyParallel: true,

    // Fail CI build if you accidentally left test.only in code
    forbidOnly: !!process.env.CI,

    // ==================== RETRY SETTINGS ====================
    // Retry failed tests on CI (0 retries locally for fast feedback)
    // SELENIUM EQUIVALENT: @Retry annotation in TestNG
    retries: process.env.CI ? 2 : 0,

    // Number of parallel workers (CI = 1 to avoid race conditions)
    workers: process.env.CI ? 1 : undefined,

    // ==================== TIMEOUT SETTINGS ====================
    // Maximum time one test can run (60s) — useful for slow pages or API calls
    // SELENIUM EQUIVALENT: @Test(timeOut = 60000) in TestNG
    timeout: 60000,

    expect: {
        // Maximum time for expect() assertions to resolve (e.g. toBeVisible, toHaveURL)
        // SELENIUM EQUIVALENT: WebDriverWait timeout
        timeout: 10000,
    },

    // ==================== REPORTER SETTINGS ====================
    // List reporter = prints each test result live in terminal
    // HTML reporter = generates a full report at playwright-report/index.html
    // JUNIT reporter = for CI tools like Jenkins, GitHub Actions
    //
    // SELENIUM EQUIVALENT: TestNG listeners + ExtentReports / Allure
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['json', { outputFile: 'test-results/results.json' }],
    ],

    use: {
        // BASE_URL from .env — page.goto('/backoffice/login') auto-prepends this
        baseURL: process.env.BASE_URL,

        // Maximum time for each action (click, fill, etc.) to complete
        // SELENIUM EQUIVALENT: implicit wait / explicit wait timeout
        actionTimeout: 15000,

        // Maximum time for navigation (page.goto, page.goBack, etc.)
        navigationTimeout: 30000,

        // ==================== SCREENSHOT SETTINGS ====================
        // 'off'             → No screenshots
        // 'on'              → Screenshot after EVERY test
        // 'only-on-failure' → Screenshot ONLY on failure (recommended)
        screenshot: 'only-on-failure',

        // ==================== VIDEO SETTINGS ====================
        // 'off'               → No video
        // 'on'                → Record video for EVERY test
        // 'retain-on-failure' → Record all, delete videos of passed tests (recommended)
        // 'on-first-retry'    → Record only on retry
        video: 'retain-on-failure',

        // ==================== TRACE SETTINGS ====================
        // Trace = detailed recording (network, DOM, clicks, console logs)
        // Open with: npx playwright show-trace trace.zip
        // 'on-first-retry' → Collect trace only when retrying failed tests
        trace: 'on-first-retry',

        // Locale for the browser (useful for date/currency formatting tests)
        locale: 'en-IN',

        // Timezone for the browser
        timezoneId: 'Asia/Kolkata',
    },

    // ==================== BROWSER PROJECTS ====================
    // SELENIUM EQUIVALENT: <browsers> section in TestNG.xml
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

        // Mobile browser — uncomment to enable
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
    ],

    // ==================== OUTPUT DIRECTORIES ====================
    // Where to store test artifacts (screenshots, videos, traces)
    outputDir: 'test-results/',
});
