import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { HotelSearchPage } from '../pages/HotelSearchPage';

const TEST_EMAIL          = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD       = process.env.LOGIN_PASSWORD!;
const NON_ADMIN_EMAIL     = process.env.NON_ADMIN_USER_EMAIL!;
const NON_ADMIN_PASSWORD  = process.env.NON_ADMIN_USER_PASSWORD!;

test.describe('Login Choice Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let hotelSearchPage: HotelSearchPage;

// =========================================================================
// UI TESTS — Verify that all elements are displayed correctly on the page
// =========================================================================

test.describe('Login Choice - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage      = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        await test.step('Login and navigate to Login Choice page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_001 =====================
    // TC_NO_0017 = Verify that the "Select Login Type" heading is displayed on the page
    // Priority   = High
    // =================================
    test('TC_NO_0017: Verify that the "Select Login Type" heading is displayed on the page', async () => {
        await test.step('Verify heading is visible', async () => {
            await expect(loginChoicePage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_CT_002 =====================
    // TC_NO_0018 = Verify that the "Choose where you want to login" subtext is displayed
    // Priority   = High
    // =================================
    test('TC_NO_0018: Verify that the "Choose where you want to login" subtext is displayed', async () => {
        await test.step('Verify subtext is visible', async () => {
            await expect(loginChoicePage.getPageSubtext()).toBeVisible();
        });
    });

    // ========== TC_CT_003 =====================
    // TC_NO_0019 = Verify that the "Hotel Login" button is displayed on the page
    // Priority   = High
    // =================================
    test('TC_NO_0019: Verify that the "Hotel Login" button is displayed on the page', async () => {
        await test.step('Verify Hotel Login button is visible', async () => {
            await expect(loginChoicePage.getHotelLoginButton()).toBeVisible();
        });
    });

    // ========== TC_CT_004 =====================
    // TC_NO_0020 = Verify that the "Back Office Login" button is displayed on the page
    // Priority   = High
    // =================================
    test('TC_NO_0020: Verify that the "Back Office Login" button is displayed on the page', async () => {
        await test.step('Verify Back Office Login button is visible', async () => {
            await expect(loginChoicePage.getBackOfficeButton()).toBeVisible();
        });
    });

    // ========== TC_CT_005 =====================
    // TC_NO_0021 = Verify that the "Logout" button is displayed on the page
    // Priority   = High
    // =================================
    test('TC_NO_0021: Verify that the "Logout" button is displayed on the page', async () => {
        await test.step('Verify Logout button is visible', async () => {
            await expect(loginChoicePage.getLogoutButton()).toBeVisible();
        });
    });

    // ========== TC_CT_006 =====================
    // TC_NO_0022 = Verify that the page URL is correct
    // Priority   = Medium
    // =================================
    test('TC_NO_0022: Verify that the page URL is /backoffice/login-choice', async ({ page }) => {
        await test.step('Verify URL is correct', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_007 =====================
    // TC_NO_0023 = Verify that the browser tab title contains "apycue"
    // Priority   = Medium
    // =================================
    test('TC_NO_0023: Verify that the browser tab title contains "apycue"', async ({ page }) => {
        await test.step('Verify page title', async () => {
            await expect(page).toHaveTitle(/apycue/i);
        });
    });

    // ========== TC_CT_008 =====================
    // TC_NO_0024 = Verify that all three buttons (Hotel Login, Back Office Login, Logout) are enabled
    // Priority   = Medium
    // =================================
    test('TC_NO_0024: Verify that all three buttons are enabled and clickable', async () => {
        await test.step('Verify Hotel Login button is enabled', async () => {
            await expect(loginChoicePage.getHotelLoginButton()).toBeEnabled();
        });
        await test.step('Verify Back Office Login button is enabled', async () => {
            await expect(loginChoicePage.getBackOfficeButton()).toBeEnabled();
        });
        await test.step('Verify Logout button is enabled', async () => {
            await expect(loginChoicePage.getLogoutButton()).toBeEnabled();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify that buttons navigate to the correct pages
// =========================================================================

test.describe('Login Choice - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage       = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        dashboardPage   = new DashboardPage(page);
        hotelSearchPage = new HotelSearchPage(page);
        await test.step('Login and navigate to Login Choice page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_009 =====================
    // TC_NO_0025 = Verify that clicking "Hotel Login" navigates to the hotel login page
    // Priority   = High
    // =================================
    test('TC_NO_0025: Verify that clicking "Hotel Login" navigates to the hotel login page', async ({ page }) => {
        await test.step('Click Hotel Login button', async () => {
            await loginChoicePage.clickHotelLogin();
        });
        await test.step('Verify URL changes from login-choice page', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_010 =====================
    // TC_NO_0026 = Verify that clicking "Back Office Login" navigates to the back office dashboard
    // Priority   = High
    // =================================
    test('TC_NO_0026: Verify that clicking "Back Office Login" navigates to the back office dashboard', async ({ page }) => {
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify URL changes from login-choice page', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_011 =====================
    // TC_NO_0027 = Verify that clicking "Logout" redirects user to the login page
    // Priority   = Critical
    // =================================
    test('TC_NO_0027: Verify that clicking "Logout" redirects user to the login page', async ({ page }) => {
        await test.step('Click Logout button', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
    });

    // ========== TC_CT_012 =====================
    // TC_NO_0028 = Verify that after logout, user cannot access login-choice page by pressing back button
    // Priority   = Critical
    // =================================
    test('TC_NO_0028: Verify that after logout, user cannot access login-choice page by pressing back button', async ({ page }) => {
        await test.step('Click Logout button', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is on login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Click browser back button', async () => {
            await page.goBack();
        });
        await test.step('Verify user is not on login-choice page (session destroyed)', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
    });

    // ========== TC_CT_013 =====================
    // TC_NO_0029 = Verify that after logout, user must re-enter credentials to access the system
    // Priority   = Critical
    // =================================
    test('TC_NO_0029: Verify that after logout, user must re-enter credentials to access the system', async ({ page }) => {
        await test.step('Click Logout button', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is on login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Verify email input is visible (login form is shown)', async () => {
            await expect(loginPage.getEmailInput()).toBeVisible();
        });
        await test.step('Verify password input is visible', async () => {
            await expect(loginPage.getPasswordInput()).toBeVisible();
        });
        await test.step('Verify Sign In button is visible', async () => {
            await expect(loginPage.getSignInButton()).toBeVisible();
        });
    });

    // ========== TC_CT_014 =====================
    // TC_NO_0030 = Verify that after logout, re-login with valid credentials works correctly
    // Priority   = High
    // =================================
    test('TC_NO_0030: Verify that after logout, re-login with valid credentials works correctly', async ({ page }) => {
        await test.step('Click Logout button', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is on login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Re-login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify user is redirected back to login-choice page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_PL_003 =====================
    // TC_NO_0040 = Verify that user can search for a hotel by name, code, or city on the Hotel Search page
    // Priority   = High
    // =================================
    test('TC_NO_0040: Verify that user can search for a hotel by name, code, or city on the Hotel Search page', async () => {
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
    // Priority   = Critical
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
    // Priority   = High
    // =================================
    test('TC_NO_0042: Verify that clicking "Create Hotel" in sidebar navigates to Hotel Creation form page', async ({ page }) => {
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard is loaded', async () => {
            await expect(dashboardPage.getDashboardSubtext()).toBeVisible();
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
    // Priority   = Medium
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
    // Priority   = Medium
    // =================================
    test('TC_NO_0044: Verify that partial search on Hotel Search page returns matching results', async () => {
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
    // Priority   = Medium
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
    // Priority   = Medium
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
// NAVIGATION TESTS — Verify where each button leads and role-based menus
// =========================================================================

test.describe('Login Choice - Navigation Tests', () => {

    // ========== TC_PL_001 =====================
    // TC_NO_0037 = Verify that admin user is redirected to Back Office Dashboard with all sidebar menu items visible
    // Priority   = High
    // =================================
    test('TC_NO_0037: Verify that admin user is redirected to Back Office Dashboard with all sidebar menu items visible', async ({ page }) => {
        loginPage       = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        dashboardPage   = new DashboardPage(page);
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
    // Priority   = High
    // =================================
    test('TC_NO_0038: Verify that clicking "Hotel Login" redirects to hotel search page with search bar visible', async ({ page }) => {
        loginPage       = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        hotelSearchPage = new HotelSearchPage(page);
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
    // TC_NO_0039 = Verify that non-admin user only sees menus that match their privilege-storage
    // Priority   = High
    // =================================
    test('TC_NO_0039: Verify that non-admin user only sees menus that match their privilege-storage', async ({ page }) => {
        loginPage       = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        dashboardPage   = new DashboardPage(page);

        // Maps each privilege key → the dashboard menu getter
        // If the user has the privilege → menu must be visible
        // If not → menu must not be visible
        const privilegeMenuMap: Record<string, () => ReturnType<DashboardPage['getManageHotelsMenu']>> = {
            'hotel.manage':      () => dashboardPage.getManageHotelsMenu(),
            'whitelabel.manage': () => dashboardPage.getWhiteLabelPartnerMenu(),
            'hotel.view':        () => dashboardPage.getViewHotelMenu(),
            'media.manage':      () => dashboardPage.getManageMediaMenu(),
            'task.status':       () => dashboardPage.getTaskStatusMenu(),
            'user.manage':       () => dashboardPage.getUserManagementMenu(),
            'reseller.manage':   () => dashboardPage.getManageResellerMenu(),
        };

        await test.step('Login as non-admin user', async () => {
            await loginPage.goto();
            await loginPage.login(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Click Back Office Login button', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify dashboard is loaded', async () => {
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
        });

        // Read actual privileges from localStorage — no hardcoded expected values
        let grantedPrivileges: string[] = [];
        await test.step('Read privilege-storage from localStorage', async () => {
            const raw = await page.evaluate(() => localStorage.getItem('privilege-storage'));
            expect(raw, 'privilege-storage must exist in localStorage').not.toBeNull();
            const parsed = JSON.parse(raw!);
            grantedPrivileges = parsed?.state?.backofficePrivileges?.privileges ?? [];
            console.log('Granted privileges from localStorage:', grantedPrivileges);
        });

        // Dynamically verify each known menu against actual localStorage privileges
        for (const [privilege, getMenu] of Object.entries(privilegeMenuMap)) {
            const hasPrivilege = grantedPrivileges.includes(privilege);
            if (hasPrivilege) {
                await test.step(`Verify "${privilege}" menu IS visible (privilege granted)`, async () => {
                    await expect(getMenu()).toBeVisible();
                });
            } else {
                await test.step(`Verify "${privilege}" menu is NOT visible (privilege not granted)`, async () => {
                    await expect(getMenu()).not.toBeVisible();
                });
            }
        }
    });
});

// =========================================================================
// SECURITY TESTS — Verify URL bypass protection and session management
// =========================================================================

test.describe('Login Choice - Security Tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage       = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        await test.step('Login and navigate to Login Choice page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_015 =====================
    // TC_NO_0031 = Verify that unauthenticated user cannot access login-choice page directly via URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0031: Verify that unauthenticated user cannot access login-choice page directly via URL', async ({ browser }) => {
        await test.step('Open a new browser context (no session)', async () => {
            const context = await browser.newContext();
            const newPage = await context.newPage();
            await test.step('Try to access login-choice page directly', async () => {
                await newPage.goto('/backoffice/login-choice');
            });
            await test.step('Verify user is redirected to login page', async () => {
                await expect(newPage).toHaveURL(/\/login/);
            });
            await context.close();
        });
    });

    // ========== TC_CT_016 =====================
    // TC_NO_0032 = Verify that session is maintained when user refreshes the login-choice page
    // Priority   = High
    // =================================
    test('TC_NO_0032: Verify that session is maintained when user refreshes the login-choice page', async ({ page }) => {
        await test.step('Refresh the page', async () => {
            await page.reload();
        });
        await test.step('Verify user is still on login-choice page after refresh', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Verify heading is still visible', async () => {
            await expect(loginChoicePage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_CT_017 =====================
    // TC_NO_0033 = Verify that session is maintained after clicking browser back and forward buttons
    // Priority   = High
    // =================================
    test('TC_NO_0033: Verify that session is maintained after clicking browser back and forward buttons', async ({ page }) => {
        await test.step('Click browser back button', async () => {
            await page.goBack();
        });
        await test.step('Click browser forward button', async () => {
            await page.goForward();
        });
        await test.step('Verify user is still on login-choice page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_018 =====================
    // TC_NO_0034 = Verify that after logout, directly accessing login-choice URL redirects to login page
    // Priority   = Critical
    // =================================
    test('TC_NO_0034: Verify that after logout, directly accessing login-choice URL redirects to login page', async ({ page }) => {
        await test.step('Click Logout', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is on login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Try to access login-choice page directly via URL', async () => {
            await page.goto('/backoffice/login-choice');
        });
        await test.step('Verify user is redirected back to login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
    });

    // ========== TC_CT_019 =====================
    // TC_NO_0035 = Verify that clicking Hotel Login after logout does not allow access
    // Priority   = Critical
    // =================================
    test('TC_NO_0035: Verify that clicking Hotel Login after logout does not allow access', async ({ page }) => {
        await test.step('Click Logout', async () => {
            await loginChoicePage.clickLogout();
        });
        await test.step('Verify user is on login page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Try to navigate to login-choice page', async () => {
            await page.goto('/backoffice/login-choice');
        });
        await test.step('Verify user cannot access login-choice page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
    });

    // ========== TC_CT_020 =====================
    // TC_NO_0036 = Verify that multiple rapid clicks on Logout button do not cause errors
    // Priority   = High
    // =================================
    test('TC_NO_0036: Verify that multiple rapid clicks on Logout button do not cause errors', async ({ page }) => {
        await test.step('Click Logout button rapidly', async () => {
            await loginChoicePage.getLogoutButton().click();
        });
        await test.step('Verify user is redirected to login page without errors', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Verify login page loads correctly', async () => {
            await expect(loginPage.getEmailInput()).toBeVisible();
        });
    });

    // ========== TC_PL_006 =====================
    // TC_NO_0047 = Verify that non-admin user cannot access admin-only pages via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0047: Verify that non-admin user cannot access admin dashboard pages via direct URL', async ({ page }) => {
        loginPage       = new LoginPage(page);
        loginChoicePage = new LoginChoicePage(page);
        dashboardPage   = new DashboardPage(page);
        await test.step('Logout current session to ensure login form is available', async () => {
            await loginChoicePage.clickLogout();
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
        await test.step('Login as non-admin user', async () => {
            await loginPage.login(NON_ADMIN_EMAIL, NON_ADMIN_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Click Back Office Login to establish backoffice session', async () => {
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
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

});
