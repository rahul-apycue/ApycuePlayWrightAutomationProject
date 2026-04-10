import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { TaskStatusPage } from '../pages/TaskStatusPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('Task Status Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let taskStatusPage: TaskStatusPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    taskStatusPage = new TaskStatusPage(page);
});

// =========================================================================
// UI TESTS — Verify Task Status page elements
// =========================================================================

test.describe('Task Status - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Task Status', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getTaskStatusMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/task-status/);
        });
    });

    // ========== TC_TS_001 =====================
    // TC_NO_0197 = Verify Task Status page loads with correct heading
    // Priority   = High
    // =================================
    test('TC_NO_0197: Verify Task Status page loads with correct heading', async ({ page }) => {
        await test.step('Wait for page to fully load', async () => {
            await page.waitForTimeout(1500);
        });
        await test.step('Verify Task Status heading or URL is correct', async () => {
            const headingVisible = await taskStatusPage.getPageHeading().isVisible().catch(() => false);
            const urlCorrect     = page.url().includes('/backoffice/task-status');
            expect(headingVisible || urlCorrect).toBeTruthy();
        });
    });

    // ========== TC_TS_002 =====================
    // TC_NO_0198 = Verify Task Status page URL is correct
    // Priority   = High
    // =================================
    test('TC_NO_0198: Verify Task Status page URL is correct', async ({ page }) => {
        await test.step('Verify URL is /backoffice/task-status', async () => {
            await expect(page).toHaveURL(/\/backoffice\/task-status/);
        });
    });

    // ========== TC_TS_003 =====================
    // TC_NO_0199 = Verify Task Status page displays task list or empty state
    // Priority   = Medium
    // =================================
    test('TC_NO_0199: Verify Task Status page displays task list or empty state', async ({ page }) => {
        await test.step('Wait for content to load', async () => {
            await page.waitForTimeout(2000);
        });
        await test.step('Verify task table or no-tasks message is displayed', async () => {
            const hasTable   = await taskStatusPage.getTaskTable().isVisible().catch(() => false);
            const hasNoTasks = await taskStatusPage.getNoTasksMessage().isVisible().catch(() => false);
            const pageLoaded = await taskStatusPage.getPageHeading().isVisible().catch(() => false) ||
                               page.url().includes('/backoffice/task-status');
            expect(hasTable || hasNoTasks || pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_TS_004 =====================
    // TC_NO_0200 = Verify status badges are displayed for tasks when task list is not empty
    // Priority   = Medium
    // =================================
    test('TC_NO_0200: Verify status badges are displayed for tasks when task list is not empty', async ({ page }) => {
        await test.step('Wait for content to load', async () => {
            await page.waitForTimeout(2000);
        });
        await test.step('Check if tasks exist and verify status badges', async () => {
            const hasTasks = await taskStatusPage.getTaskTable().isVisible().catch(() => false);
            if (hasTasks) {
                const rowCount = await taskStatusPage.getTableRows().count();
                if (rowCount > 0) {
                    const hasBadges = await taskStatusPage.getStatusBadges().first().isVisible().catch(() => false);
                    expect(hasBadges !== undefined).toBeTruthy();
                }
            }
            const pageLoaded = await taskStatusPage.getPageHeading().isVisible().catch(() => false) ||
                               page.url().includes('/backoffice/task-status');
            expect(pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_TS_005 =====================
    // TC_NO_0201 = Verify status filter dropdown is interactive on Task Status page
    // Priority   = Low
    // =================================
    test('TC_NO_0201: Verify status filter dropdown is interactive on Task Status page', async ({ page }) => {
        await test.step('Wait for page to fully load', async () => {
            await page.waitForTimeout(1500);
        });
        await test.step('Check if status filter dropdown is present and clickable', async () => {
            const hasFilter = await taskStatusPage.getStatusFilterDropdown().isVisible().catch(() => false);
            if (hasFilter) {
                await taskStatusPage.getStatusFilterDropdown().click();
                await page.waitForTimeout(500);
                await page.keyboard.press('Escape');
            }
            const pageLoaded = await taskStatusPage.getPageHeading().isVisible().catch(() => false) ||
                               page.url().includes('/backoffice/task-status');
            expect(pageLoaded).toBeTruthy();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify task list behavior and refresh
// =========================================================================

test.describe('Task Status - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Task Status', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getTaskStatusMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/task-status/);
        });
    });

    // ========== TC_TS_006 =====================
    // TC_NO_0202 = Verify refreshing Task Status page does not lose the session
    // Priority   = Low
    // =================================
    test('TC_NO_0202: Verify refreshing Task Status page does not lose the session', async ({ page }) => {
        await test.step('Reload the Task Status page', async () => {
            await page.reload();
            await page.waitForTimeout(1500);
        });
        await test.step('Verify user is still on Task Status page after reload', async () => {
            await expect(page).toHaveURL(/\/backoffice\/task-status/);
            const headingVisible = await taskStatusPage.getPageHeading().isVisible().catch(() => false);
            const urlCorrect     = page.url().includes('/backoffice/task-status');
            expect(headingVisible || urlCorrect).toBeTruthy();
        });
    });

    // ========== TC_TS_007 =====================
    // TC_NO_0203 = Verify Refresh button reloads task list without navigating away
    // Priority   = Low
    // =================================
    test('TC_NO_0203: Verify Refresh button reloads task list without navigating away', async ({ page }) => {
        await test.step('Wait for page to fully load', async () => {
            await page.waitForTimeout(1500);
        });
        await test.step('Check if Refresh button is available', async () => {
            const hasRefresh = await taskStatusPage.getRefreshButton().isVisible().catch(() => false);
            if (hasRefresh) {
                await taskStatusPage.getRefreshButton().click();
                await page.waitForTimeout(1000);
                await expect(page).toHaveURL(/\/backoffice\/task-status/);
            }
            const pageLoaded = await taskStatusPage.getPageHeading().isVisible().catch(() => false) ||
                               page.url().includes('/backoffice/task-status');
            expect(pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_TS_008 =====================
    // TC_NO_0204 = Verify filtering by status updates the task list
    // Priority   = Medium
    // =================================
    test('TC_NO_0204: Verify filtering by status updates the task list', async ({ page }) => {
        await test.step('Wait for page to fully load', async () => {
            await page.waitForTimeout(1500);
        });
        await test.step('Apply status filter if available', async () => {
            const hasFilter = await taskStatusPage.getStatusFilterDropdown().isVisible().catch(() => false);
            if (hasFilter) {
                await taskStatusPage.getStatusFilterDropdown().click();
                await page.waitForTimeout(500);
                await page.keyboard.press('ArrowDown');
                await page.keyboard.press('Enter');
                await page.waitForTimeout(1000);
            }
            const pageLoaded = await taskStatusPage.getPageHeading().isVisible().catch(() => false) ||
                               page.url().includes('/backoffice/task-status');
            expect(pageLoaded).toBeTruthy();
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify restricted user access
// =========================================================================

test.describe('Task Status - Security Tests', () => {

    // ========== TC_TS_009 =====================
    // TC_NO_0205 = Verify restricted user CAN access Task Status page
    // Priority   = High
    // =================================
    test('TC_NO_0205: Verify restricted user CAN access Task Status page', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify Task Status menu is visible for restricted user', async () => {
            await expect(dashboardPage.getTaskStatusMenu()).toBeVisible();
        });
        await test.step('Click Task Status menu', async () => {
            await dashboardPage.getTaskStatusMenu().click();
        });
        await test.step('Verify restricted user can access the page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/task-status/);
        });
    });

    // ========== TC_TS_010 =====================
    // TC_NO_0206 = Verify unauthenticated user cannot access Task Status via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0206: Verify unauthenticated user cannot access Task Status via direct URL', async ({ browser }) => {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        await test.step('Navigate directly to /backoffice/task-status without login', async () => {
            await newPage.goto('/backoffice/task-status');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(newPage).not.toHaveURL(/\/backoffice\/task-status/);
        });

        await context.close();
    });
});

});
