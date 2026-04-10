import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('Dashboard Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
});

// =========================================================================
// UI TESTS — Verify dashboard elements and menu visibility for different roles
// =========================================================================

test.describe('Dashboard - UI Tests', () => {

    // ========== TC_DB_001 =====================
    // TC_NO_0048 = Verify that admin user can see all sidebar menu items on the Dashboard
    // Priority   = High
    // =================================
    test('TC_NO_0048: Verify that admin user can see all sidebar menu items on the Dashboard', async ({ page }) => {
        await test.step('Login as admin user', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Navigate to Back Office Dashboard', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard is loaded', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });
        await test.step('Verify "Create Hotel" menu is visible', async () => {
            await expect(dashboardPage.getCreateHotelMenu()).toBeVisible();
        });
        await test.step('Verify "Manage Hotels" menu is visible', async () => {
            await expect(dashboardPage.getManageHotelsMenu()).toBeVisible();
        });
        await test.step('Verify "User Management" menu is visible', async () => {
            await expect(dashboardPage.getUserManagementMenu()).toBeVisible();
        });
        await test.step('Verify "Manage Reseller" menu is visible', async () => {
            await expect(dashboardPage.getManageResellerMenu()).toBeVisible();
        });
        await test.step('Verify "White Label Partner" menu is visible', async () => {
            await expect(dashboardPage.getWhiteLabelPartnerMenu()).toBeVisible();
        });
        await test.step('Verify "View Hotel" menu is visible', async () => {
            await expect(dashboardPage.getViewHotelMenu()).toBeVisible();
        });
        await test.step('Verify "Manage Media" menu is visible', async () => {
            await expect(dashboardPage.getManageMediaMenu()).toBeVisible();
        });
        await test.step('Verify "Task Status" menu is visible', async () => {
            await expect(dashboardPage.getTaskStatusMenu()).toBeVisible();
        });
    });

    // ========== TC_DB_002 =====================
    // TC_NO_0049 = Verify that restricted user only sees permitted menu items on the Dashboard
    // Priority   = High
    // =================================
    test('TC_NO_0049: Verify that restricted user only sees permitted menu items on the Dashboard', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Navigate to Back Office Dashboard', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify "Manage Hotels" menu is visible for restricted user', async () => {
            await expect(dashboardPage.getManageHotelsMenu()).toBeVisible();
        });
        await test.step('Verify "White Label Partner" menu is visible for restricted user', async () => {
            await expect(dashboardPage.getWhiteLabelPartnerMenu()).toBeVisible();
        });
        await test.step('Verify "View Hotel" menu is visible for restricted user', async () => {
            await expect(dashboardPage.getViewHotelMenu()).toBeVisible();
        });
        await test.step('Verify "Manage Media" menu is visible for restricted user', async () => {
            await expect(dashboardPage.getManageMediaMenu()).toBeVisible();
        });
        await test.step('Verify "Task Status" menu is visible for restricted user', async () => {
            await expect(dashboardPage.getTaskStatusMenu()).toBeVisible();
        });
        await test.step('Verify "Create Hotel" menu is NOT visible for restricted user', async () => {
            await expect(dashboardPage.getCreateHotelMenu()).not.toBeVisible();
        });
        await test.step('Verify "User Management" menu is NOT visible for restricted user', async () => {
            await expect(dashboardPage.getUserManagementMenu()).not.toBeVisible();
        });
        await test.step('Verify "Manage Reseller" menu is NOT visible for restricted user', async () => {
            await expect(dashboardPage.getManageResellerMenu()).not.toBeVisible();
        });
        await test.step('Verify "Data Discovery" menu is NOT visible for restricted user', async () => {
            await expect(dashboardPage.getDataDiscoveryMenu()).not.toBeVisible();
        });
    });

    // ========== TC_DB_008 =====================
    // TC_NO_0050 = Verify that the welcome message displays the correct user name
    // Priority   = Medium
    // =================================
    test('TC_NO_0050: Verify that the welcome message displays the correct user name', async ({ page }) => {
        await test.step('Login as admin user', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Navigate to Back Office Dashboard', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify welcome message shows "Welcome back, Backoffice!"', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await expect(dashboardPage.getWelcomeHeading()).toContainText('Welcome back');
        });
        await test.step('Verify "Backoffice Administration Dashboard" subtext is displayed', async () => {
            await expect(dashboardPage.getDashboardSubtext()).toBeVisible();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify menu redirection and navigation
// =========================================================================

test.describe('Dashboard - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Dashboard', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });
    });

    // ========== TC_DB_003 =====================
    // TC_NO_0051 = Verify that clicking each sidebar menu item redirects to the correct page
    // Priority   = High
    // =================================
    test('TC_NO_0051: Verify that clicking "User Management" menu redirects to /backoffice/users', async ({ page }) => {
        await test.step('Click "User Management" menu item', async () => {
            await dashboardPage.getUserManagementMenu().click();
        });
        await test.step('Verify URL changes to /backoffice/users', async () => {
            await expect(page).toHaveURL(/\/backoffice\/users/);
        });
    });

    test('TC_NO_0051: Verify that clicking "Create Hotel" menu redirects to /backoffice/create-hotel', async ({ page }) => {
        await test.step('Click "Create Hotel" menu item', async () => {
            await dashboardPage.clickCreateHotel();
        });
        await test.step('Verify URL changes to /backoffice/create-hotel', async () => {
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    test('TC_NO_0051: Verify that clicking "Manage Hotels" menu redirects to /backoffice/manage-hotels', async ({ page }) => {
        await test.step('Click "Manage Hotels" menu item', async () => {
            await dashboardPage.getManageHotelsMenu().click();
        });
        await test.step('Verify URL changes to /backoffice/manage-hotels', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-hotels/);
        });
    });

    test('TC_NO_0051: Verify that clicking "Manage Reseller" menu redirects to /backoffice/manage-resellers', async ({ page }) => {
        await test.step('Click "Manage Reseller" menu item', async () => {
            await dashboardPage.getManageResellerMenu().click();
        });
        await test.step('Verify URL changes to /backoffice/manage-resellers', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-resellers/);
        });
    });

    test('TC_NO_0051: Verify that clicking "View Hotel" menu redirects to /backoffice/view-hotel', async ({ page }) => {
        await test.step('Click "View Hotel" menu item', async () => {
            await dashboardPage.getViewHotelMenu().click();
        });
        await test.step('Verify URL changes to /backoffice/view-hotel', async () => {
            await expect(page).toHaveURL(/\/backoffice\/view-hotel/);
        });
    });

    test('TC_NO_0051: Verify that clicking "Manage Media" menu redirects to /backoffice/manage-media', async ({ page }) => {
        await test.step('Click "Manage Media" menu item', async () => {
            await dashboardPage.getManageMediaMenu().click();
        });
        await test.step('Verify URL changes to /backoffice/manage-media', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-media/);
        });
    });

    test('TC_NO_0051: Verify that clicking "Task Status" menu redirects to /backoffice/task-status', async ({ page }) => {
        await test.step('Click "Task Status" menu item', async () => {
            await dashboardPage.getTaskStatusMenu().click();
        });
        await test.step('Verify URL changes to /backoffice/task-status', async () => {
            await expect(page).toHaveURL(/\/backoffice\/task-status/);
        });
    });

    // ========== TC_DB_007 =====================
    // TC_NO_0052 = Verify that browser back/forward buttons work correctly and user remains logged in
    // Priority   = Medium
    // =================================
    test('TC_NO_0052: Verify that browser back/forward buttons work correctly on the Dashboard', async ({ page }) => {
        await test.step('Click "User Management" to navigate away from dashboard', async () => {
            await dashboardPage.getUserManagementMenu().click();
        });
        await test.step('Verify URL is /backoffice/users', async () => {
            await expect(page).toHaveURL(/\/backoffice\/users/);
        });
        await test.step('Click browser back button', async () => {
            await page.goBack();
        });
        await test.step('Verify user is returned to Dashboard without re-login', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });
        await test.step('Click browser forward button', async () => {
            await page.goForward();
        });
        await test.step('Verify user navigates forward to User Management without re-login', async () => {
            await expect(page).toHaveURL(/\/backoffice\/users/);
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify unauthorized access and session management
// =========================================================================

test.describe('Dashboard - Security Tests', () => {

    // ========== TC_DB_004 =====================
    // TC_NO_0053 = Verify that restricted user cannot access admin-only pages via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0053: Verify that restricted user cannot access admin-only pages via direct URL', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Navigate to Back Office Dashboard', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Try to access /backoffice/users directly via URL', async () => {
            await page.goto('/backoffice/users');
        });
        await test.step('Verify restricted user is denied access or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/users$/);
        });
        await test.step('Try to access /backoffice/create-hotel directly via URL', async () => {
            await page.goto('/backoffice/create-hotel');
        });
        await test.step('Verify restricted user is denied access or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/create-hotel$/);
        });
        await test.step('Try to access /backoffice/manage-resellers directly via URL', async () => {
            await page.goto('/backoffice/manage-resellers');
        });
        await test.step('Verify restricted user is denied access or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/manage-resellers$/);
        });
    });

    // ========== TC_DB_005 =====================
    // TC_NO_0054 = Verify that logging out in one tab redirects other tabs to Login page
    // Priority   = Critical
    // =================================
    test('TC_NO_0054: Verify that logging out in one tab redirects other tabs to Login page', async ({ context, page }) => {
        await test.step('Login as admin in Tab 1', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });

        const page2 = await context.newPage();
        const loginPage2 = new LoginPage(page2);
        const dashboardPage2 = new DashboardPage(page2);

        await test.step('Open Tab 2 and navigate to Dashboard', async () => {
            await page2.goto('/backoffice/dashboard');
            await expect(dashboardPage2.getWelcomeHeading()).toBeVisible();
        });

        await test.step('Logout from Tab 1 using profile hover card', async () => {
            await page.bringToFront();
            await dashboardPage.hoverProfileButton();
            await dashboardPage.getProfileLogoutButton().click();
        });
        await test.step('Verify Tab 1 is on login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });

        await test.step('Switch to Tab 2 and reload', async () => {
            await page2.bringToFront();
            await page2.reload();
        });
        await test.step('Verify Tab 2 is redirected to Login page (session expired)', async () => {
            await expect(page2).toHaveURL(/\/login/);
        });

        await page2.close();
    });
});

});
