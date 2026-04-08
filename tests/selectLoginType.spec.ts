import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { HotelSearchPage } from '../pages/HotelSearchPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;
const NON_ADMIN_EMAIL = process.env.NON_ADMIN_USER_EMAIL!;
const NON_ADMIN_PASSWORD = process.env.NON_ADMIN_USER_PASSWORD!;

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let hotelSearchPage: HotelSearchPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    hotelSearchPage = new HotelSearchPage(page);
});

// =========================================================================
// UI TESTS — Verify dashboard elements and menu visibility
// =========================================================================

test.describe('Select Login Type - UI Tests', () => {

    // ========== TC_PL_001 =====================
    // TC_NO_0037 = Verify that admin user is redirected to Back Office Dashboard with all sidebar menu items visible
    // =================================
    test('TC_NO_0037: Verify that admin user is redirected to Back Office Dashboard with all sidebar menu items visible', async ({ page }) => {
        await test.step('Login as admin user', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard welcome heading is visible', async () => {
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

    // ========== TC_PL_002 =====================
    // TC_NO_0038 = Verify that clicking "Hotel Login" redirects to hotel search page with search bar visible
    // =================================
    test('TC_NO_0038: Verify that clicking "Hotel Login" redirects to hotel search page with search bar visible', async ({ page }) => {
        await test.step('Login as admin user', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Click Hotel Login button', async () => {
            await loginChoicePage.clickHotelLogin();
        });
        await test.step('Verify "Hotel Login" heading is visible', async () => {
            await expect(hotelSearchPage.getPageHeading()).toBeVisible();
        });
        await test.step('Verify "Search by name, code, or city" subtext is visible', async () => {
            await expect(hotelSearchPage.getPageSubtext()).toBeVisible();
        });
        await test.step('Verify search input is visible', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
    });

    // ========== TC_PL_008 =====================
    // TC_NO_0039 = Verify that restricted user only sees permitted menu items on the dashboard
    // =================================
    test('TC_NO_0039: Verify that restricted user only sees permitted menu items on the dashboard', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Click Back Office Login button', async () => {
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
});

// =========================================================================
// FUNCTIONAL TESTS — Verify navigation, search, and logout functionality
// =========================================================================

test.describe('Select Login Type - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to login-choice page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_PL_003 =====================
    // TC_NO_0040 = Verify that user can search for a hotel by name, code, or city on the Hotel Search page
    // =================================
    test('TC_NO_0040: Verify that user can search for a hotel by name, code, or city on the Hotel Search page', async ({ page }) => {
        await test.step('Click Hotel Login button', async () => {
            await loginChoicePage.clickHotelLogin();
        });
        await test.step('Verify search input is visible', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
        await test.step('Search by hotel code', async () => {
            await hotelSearchPage.searchHotel('3');
        });
        await test.step('Verify search results appear', async () => {
            await expect(hotelSearchPage.getSearchResults().first()).toBeVisible();
        });
    });

    // ========== TC_PL_004 =====================
    // TC_NO_0041 = Verify that user can logout from the login-choice page and session is terminated
    // =================================
    test('TC_NO_0041: Verify that user can logout from the login-choice page and session is terminated', async ({ page }) => {
        await test.step('Click Logout button', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Verify login form is displayed (session ended)', async () => {
            await expect(loginPage.getEmailInput()).toBeVisible();
        });
    });

    // ========== TC_PL_007 =====================
    // TC_NO_0042 = Verify that clicking "Create Hotel" in sidebar navigates to Hotel Creation form page
    // =================================
    test('TC_NO_0042: Verify that clicking "Create Hotel" in sidebar navigates to Hotel Creation form page', async ({ page }) => {
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard is loaded', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });
        await test.step('Click "Create Hotel" menu item', async () => {
            await dashboardPage.clickCreateHotel();
        });
        await test.step('Verify URL changes to /backoffice/create-hotel', async () => {
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== TC_PL_009 =====================
    // TC_NO_0043 = Verify that user can navigate back to "Select Login Type" page from the dashboard
    // =================================
    test('TC_NO_0043: Verify that user can navigate back to "Select Login Type" page from the dashboard', async ({ page }) => {
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard is loaded', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });
        await test.step('Click back button in sidebar', async () => {
            await dashboardPage.clickBackButton();
        });
        await test.step('Verify user is redirected to "Select Login Type" page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_PL_010 =====================
    // TC_NO_0044 = Verify that partial search on Hotel Search page returns matching results
    // =================================
    test('TC_NO_0044: Verify that partial search on Hotel Search page returns matching results', async ({ page }) => {
        await test.step('Click Hotel Login button', async () => {
            await loginChoicePage.clickHotelLogin();
        });
        await test.step('Search with partial name "Mar"', async () => {
            await hotelSearchPage.searchHotel('Mar');
        });
        await test.step('Verify matching hotel results appear in the list', async () => {
            await expect(hotelSearchPage.getSearchResults().first()).toBeVisible();
        });
    });

    // ========== TC_PL_011 =====================
    // TC_NO_0045 = Verify that clicking back button on Hotel Search page navigates to "Select Login Type" page
    // =================================
    test('TC_NO_0045: Verify that clicking back button on Hotel Search page navigates to "Select Login Type" page', async ({ page }) => {
        await test.step('Click Hotel Login button', async () => {
            await loginChoicePage.clickHotelLogin();
        });
        await test.step('Verify Hotel Search page is loaded', async () => {
            await expect(hotelSearchPage.getPageHeading()).toBeVisible();
        });
        await test.step('Click back button', async () => {
            await hotelSearchPage.clickBackButton();
        });
        await test.step('Verify user is redirected to "Select Login Type" page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_PL_013 =====================
    // TC_NO_0046 = Verify that user can access profile details from the dashboard
    // =================================
    test('TC_NO_0046: Verify that user can access profile details from the dashboard', async () => {
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard is loaded', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });
        await test.step('Hover over profile button to open hover card', async () => {
            await dashboardPage.hoverProfileButton();
        });
        await test.step('Verify "Backoffice Admin" name is displayed in profile card', async () => {
            await expect(dashboardPage.getProfileName()).toBeVisible();
        });
        await test.step('Verify "Logout" button is displayed in profile card', async () => {
            await expect(dashboardPage.getProfileLogoutButton()).toBeVisible();
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify restricted user access and URL bypass protection
// =========================================================================

test.describe('Select Login Type - Security Tests', () => {

    // ========== TC_PL_006 =====================
    // TC_NO_0047 = Verify that restricted user cannot access admin dashboard pages via direct URL
    // =================================
    test('TC_NO_0047: Verify that non-admin user cannot access admin dashboard pages via direct URL', async ({ page }) => {
        await test.step('Login as non-admin user', async () => {
            await loginPage.goto();
            await loginPage.login(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Try to access /backoffice/users directly via URL', async () => {
            await page.goto('/backoffice/users');
        });
        await test.step('Verify restricted user is denied access or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/users/);
        });
        await test.step('Try to access /backoffice/create-hotel directly via URL', async () => {
            await page.goto('/backoffice/create-hotel');
        });
        await test.step('Verify restricted user is denied access or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/create-hotel/);
        });
    });
});
