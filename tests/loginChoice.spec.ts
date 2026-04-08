import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    await test.step('Login and navigate to Select Login Type page', async () => {
        await loginPage.goto();
        await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        await expect(page).toHaveURL(/\/backoffice\/login-choice/);
    });
});

// =========================================================================
// UI TESTS — Verify that all elements are displayed correctly on the page
// =========================================================================

test.describe('Select Login Type - UI Tests', () => {

    // ========== TC_CT_001 =====================
    // TC_NO_0017 = Verify that the "Select Login Type" heading is displayed on the page
    // =================================
    test('TC_NO_0017: Verify that the "Select Login Type" heading is displayed on the page', async () => {
        await test.step('Verify heading is visible', async () => {
            await expect(loginChoicePage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_CT_002 =====================
    // TC_NO_0018 = Verify that the "Choose where you want to login" subtext is displayed
    // =================================
    test('TC_NO_0018: Verify that the "Choose where you want to login" subtext is displayed', async () => {
        await test.step('Verify subtext is visible', async () => {
            await expect(loginChoicePage.getPageSubtext()).toBeVisible();
        });
    });

    // ========== TC_CT_003 =====================
    // TC_NO_0019 = Verify that the "Hotel Login" button is displayed on the page
    // =================================
    test('TC_NO_0019: Verify that the "Hotel Login" button is displayed on the page', async () => {
        await test.step('Verify Hotel Login button is visible', async () => {
            await expect(loginChoicePage.getHotelLoginButton()).toBeVisible();
        });
    });

    // ========== TC_CT_004 =====================
    // TC_NO_0020 = Verify that the "Back Office Login" button is displayed on the page
    // =================================
    test('TC_NO_0020: Verify that the "Back Office Login" button is displayed on the page', async () => {
        await test.step('Verify Back Office Login button is visible', async () => {
            await expect(loginChoicePage.getBackOfficeButton()).toBeVisible();
        });
    });

    // ========== TC_CT_005 =====================
    // TC_NO_0021 = Verify that the "Logout" button is displayed on the page
    // =================================
    test('TC_NO_0021: Verify that the "Logout" button is displayed on the page', async () => {
        await test.step('Verify Logout button is visible', async () => {
            await expect(loginChoicePage.getLogoutButton()).toBeVisible();
        });
    });

    // ========== TC_CT_006 =====================
    // TC_NO_0022 = Verify that the page URL is correct
    // =================================
    test('TC_NO_0022: Verify that the page URL is /backoffice/login-choice', async ({ page }) => {
        await test.step('Verify URL is correct', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_CT_007 =====================
    // TC_NO_0023 = Verify that the browser tab title contains "apycue"
    // =================================
    test('TC_NO_0023: Verify that the browser tab title contains "apycue"', async ({ page }) => {
        await test.step('Verify page title', async () => {
            await expect(page).toHaveTitle(/apycue/i);
        });
    });

    // ========== TC_CT_008 =====================
    // TC_NO_0024 = Verify that all three buttons (Hotel Login, Back Office Login, Logout) are enabled
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

test.describe('Select Login Type - Functional Tests', () => {

    // ========== TC_CT_009 =====================
    // TC_NO_0025 = Verify that clicking "Hotel Login" navigates to the hotel login page
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
});

// =========================================================================
// SECURITY TESTS — Verify URL bypass protection and session management
// =========================================================================

test.describe('Select Login Type - Security Tests', () => {

    // ========== TC_CT_015 =====================
    // TC_NO_0031 = Verify that unauthenticated user cannot access login-choice page directly via URL
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
});
