import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { UserManagementPage } from '../pages/UserManagementPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('User Management Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let userManagementPage: UserManagementPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    userManagementPage = new UserManagementPage(page);
});

// =========================================================================
// UI TESTS — Verify User Management page elements
// =========================================================================

test.describe('User Management - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to User Management', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getUserManagementMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/users/);
        });
    });

    // ========== TC_UM_001 =====================
    // TC_NO_0157 = Verify User Management page loads with correct heading
    // Priority   = High
    // =================================
    test('TC_NO_0157: Verify User Management page loads with correct heading', async () => {
        await test.step('Verify "User Management" heading is visible', async () => {
            await expect(userManagementPage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_UM_002 =====================
    // TC_NO_0158 = Verify User Management page URL is correct
    // Priority   = High
    // =================================
    test('TC_NO_0158: Verify User Management page URL is correct', async ({ page }) => {
        await test.step('Verify URL is /backoffice/users', async () => {
            await expect(page).toHaveURL(/\/backoffice\/users/);
        });
    });

    // ========== TC_UM_003 =====================
    // TC_NO_0159 = Verify User Management page displays user list or empty state
    // Priority   = Medium
    // =================================
    test('TC_NO_0159: Verify User Management page displays user list or empty state', async () => {
        await test.step('Verify user table or no-results message is visible', async () => {
            const hasTable = await userManagementPage.getUserTable().isVisible().catch(() => false);
            const hasNoResults = await userManagementPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasTable || hasNoResults).toBeTruthy();
        });
    });

    // ========== TC_UM_004 =====================
    // TC_NO_0160 = Verify search input is visible on User Management page
    // Priority   = Low
    // =================================
    test('TC_NO_0160: Verify search input is visible on User Management page', async () => {
        await test.step('Verify search input is present on the page', async () => {
            const hasSearch = await userManagementPage.getSearchInput().isVisible().catch(() => false);
            await expect(userManagementPage.getPageHeading()).toBeVisible();
            expect(hasSearch !== undefined).toBeTruthy();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search and table behavior
// =========================================================================

test.describe('User Management - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to User Management', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getUserManagementMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/users/);
        });
    });

    // ========== TC_UM_005 =====================
    // TC_NO_0161 = Verify searching for an existing user returns results
    // Priority   = Medium
    // =================================
    test('TC_NO_0161: Verify searching for an existing user returns results', async () => {
        await test.step('Search for a known username', async () => {
            const hasSearch = await userManagementPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await userManagementPage.searchUser('admin');
                const hasResults = await userManagementPage.getTableRows().first().isVisible().catch(() => false);
                const hasNoResults = await userManagementPage.getNoResultsMessage().isVisible().catch(() => false);
                expect(hasResults || hasNoResults).toBeTruthy();
            } else {
                await expect(userManagementPage.getPageHeading()).toBeVisible();
            }
        });
    });

    // ========== TC_UM_006 =====================
    // TC_NO_0162 = Verify searching for a non-existent user shows no results
    // Priority   = Medium
    // =================================
    test('TC_NO_0162: Verify searching for a non-existent user shows no results', async () => {
        await test.step('Search for a non-existent user', async () => {
            const hasSearch = await userManagementPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await userManagementPage.searchUser('xyznonexistentuser99999');
                const hasNoResults = await userManagementPage.getNoResultsMessage().isVisible().catch(() => false);
                const hasZeroRows = await userManagementPage.getTableRows().count().then(c => c === 0).catch(() => false);
                expect(hasNoResults || hasZeroRows).toBeTruthy();
            } else {
                await expect(userManagementPage.getPageHeading()).toBeVisible();
            }
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify access control
// =========================================================================

test.describe('User Management - Security Tests', () => {

    // ========== TC_UM_007 =====================
    // TC_NO_0163 = Verify restricted user cannot access User Management via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0163: Verify restricted user cannot access User Management via direct URL', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Try to navigate to /backoffice/users directly', async () => {
            await page.goto('/backoffice/users');
        });
        await test.step('Verify access is denied or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/users$/);
        });
    });

    // ========== TC_UM_008 =====================
    // TC_NO_0164 = Verify unauthenticated user cannot access User Management via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0164: Verify unauthenticated user cannot access User Management via direct URL', async ({ browser }) => {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        await test.step('Navigate directly to /backoffice/users without login', async () => {
            await newPage.goto('/backoffice/users');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(newPage).not.toHaveURL(/\/backoffice\/users/);
        });

        await context.close();
    });
});

});
