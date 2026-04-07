/**
 * LOGIN PAGE TEST CASES
 *
 * LOGGING APPROACH:
 * We use test.step() to add logs. Each step shows up in:
 *   - Terminal output (when you run tests)
 *   - HTML Report (npx playwright show-report)
 *   - Trace Viewer (npx playwright show-trace)
 *
 * Credentials are read from .env file, NOT hardcoded here.
 */

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
    await test.step('Navigate to Login page', async () => {
        await loginPage.goto();
    });
});

// ============================================
// GROUP 1: UI ELEMENTS VISIBILITY TESTS
// ============================================

test.describe('Login Page - UI Elements', () => {

    test('should display the Apycue logo', async () => {
        await test.step('Verify Apycue logo is visible on the page', async () => {
            await expect(loginPage.getLogo()).toBeVisible();
        });
    });

    test('should display "Backoffice Login" heading', async () => {
        await test.step('Verify "Backoffice Login" heading is visible', async () => {
            await expect(loginPage.getPageHeading()).toBeVisible();
        });
    });

    test('should display "Sign in to access your account" subtext', async () => {
        await test.step('Verify subtext "Sign in to access your account" is visible', async () => {
            await expect(loginPage.getPageSubtext()).toBeVisible();
        });
    });

    test('should display email input field', async () => {
        await test.step('Verify email input field is visible', async () => {
            await expect(loginPage.getEmailInput()).toBeVisible();
        });
    });

    test('should display password input field', async () => {
        await test.step('Verify password input field is visible', async () => {
            await expect(loginPage.getPasswordInput()).toBeVisible();
        });
    });

    test('should display Sign In button', async () => {
        await test.step('Verify Sign In button is visible', async () => {
            await expect(loginPage.getSignInButton()).toBeVisible();
        });
        await test.step('Verify Sign In button is enabled (clickable)', async () => {
            await expect(loginPage.getSignInButton()).toBeEnabled();
        });
    });

    test('should have correct page title', async ({ page }) => {
        await test.step('Verify browser tab title contains "apycue"', async () => {
            await expect(page).toHaveTitle(/apycue/i);
        });
    });
});

// ============================================
// GROUP 2: INPUT FIELD BEHAVIOR TESTS
// ============================================

test.describe('Login Page - Input Fields', () => {

    test('email field should have correct placeholder', async () => {
        await test.step('Verify email placeholder text is "Enter your email"', async () => {
            await expect(loginPage.getEmailInput()).toHaveAttribute('placeholder', 'Enter your email');
        });
    });

    test('password field should have correct placeholder', async () => {
        await test.step('Verify password placeholder text is "Enter your password"', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('placeholder', 'Enter your password');
        });
    });

    test('email field should have type "email"', async () => {
        await test.step('Verify email input type is "email"', async () => {
            await expect(loginPage.getEmailInput()).toHaveAttribute('type', 'email');
        });
    });

    test('password field should have type "password"', async () => {
        await test.step('Verify password input type is "password" (text is hidden)', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'password');
        });
    });

    test('should allow typing in email field', async () => {
        await test.step('Type "test@example.com" in email field', async () => {
            await loginPage.fillEmail('test@example.com');
        });
        await test.step('Verify email field contains "test@example.com"', async () => {
            await expect(loginPage.getEmailInput()).toHaveValue('test@example.com');
        });
    });

    test('should allow typing in password field', async () => {
        await test.step('Type "TestPassword123" in password field', async () => {
            await loginPage.fillPassword('TestPassword123');
        });
        await test.step('Verify password field contains "TestPassword123"', async () => {
            await expect(loginPage.getPasswordInput()).toHaveValue('TestPassword123');
        });
    });

    test('password toggle should change password field to text type', async () => {
        await test.step('Type "MySecret" in password field', async () => {
            await loginPage.fillPassword('MySecret');
        });
        await test.step('Verify password is hidden (type="password")', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'password');
        });
        await test.step('Click the eye icon to toggle password visibility', async () => {
            await loginPage.togglePasswordVisibility();
        });
        await test.step('Verify password is now visible (type="text")', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'text');
        });
    });
});

// ============================================
// GROUP 3: VALIDATION TESTS (Negative Scenarios)
// ============================================

test.describe('Login Page - Validation', () => {

    test('should not login with empty email and empty password', async ({ page }) => {
        await test.step('Click Sign In without entering any credentials', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user stays on login page (URL contains /login)', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    test('should not login with valid email and empty password', async ({ page }) => {
        await test.step(`Enter valid email: ${TEST_EMAIL}`, async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Leave password empty and click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user stays on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    test('should not login with empty email and valid password', async ({ page }) => {
        await test.step('Leave email empty', async () => {
            // Email is intentionally left empty
        });
        await test.step('Enter valid password', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user stays on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    test('should not login with valid email and invalid password', async ({ page }) => {
        await test.step(`Enter valid email: ${TEST_EMAIL}`, async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Enter invalid password: "WrongPassword@123"', async () => {
            await loginPage.fillPassword('WrongPassword@123');
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify login fails — user stays on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    test('should not login with invalid email and valid password', async ({ page }) => {
        await test.step('Enter invalid email: "fakeemail@invalid.com"', async () => {
            await loginPage.fillEmail('fakeemail@invalid.com');
        });
        await test.step('Enter valid password', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify login fails — user stays on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    test('should not login with invalid email and invalid password', async ({ page }) => {
        await test.step('Enter invalid email: "wrong@email.com"', async () => {
            await loginPage.fillEmail('wrong@email.com');
        });
        await test.step('Enter invalid password: "WrongPassword123"', async () => {
            await loginPage.fillPassword('WrongPassword123');
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify login fails — user stays on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    test('should not login with invalid email format', async ({ page }) => {
        await test.step('Enter invalid email format: "not-an-email" (missing @)', async () => {
            await loginPage.fillEmail('not-an-email');
        });
        await test.step('Enter valid password', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify browser blocks submission — user stays on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });
});

// ============================================
// GROUP 4: SUCCESSFUL LOGIN TESTS (Positive Scenarios)
// ============================================

test.describe('Login Page - Successful Login', () => {

    test('should login with valid credentials and redirect to login-choice page', async ({ page }) => {
        await test.step(`Enter valid email: ${TEST_EMAIL}`, async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Enter valid password', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In button', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify URL redirects to /backoffice/login-choice', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    test('should show "Login Successful" toast message after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Login Successful" toast notification appears', async () => {
            await expect(loginChoicePage.getSuccessToast()).toBeVisible();
        });
    });

    test('should show "Welcome back!" message after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Welcome back!" toast description appears', async () => {
            await expect(loginChoicePage.getWelcomeMessage()).toBeVisible();
        });
    });

    test('should display "Select Login Type" heading after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Select Login Type" heading is visible on redirected page', async () => {
            await expect(loginChoicePage.getPageHeading()).toBeVisible();
        });
    });

    test('should display "Choose where you want to login" subtext after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Choose where you want to login" subtext is visible', async () => {
            await expect(loginChoicePage.getPageSubtext()).toBeVisible();
        });
    });

    test('should display "Hotel Login" button after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Hotel Login" button is visible on login-choice page', async () => {
            await expect(loginChoicePage.getHotelLoginButton()).toBeVisible();
        });
    });

    test('should display "Back Office Login" button after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Back Office Login" button is visible on login-choice page', async () => {
            await expect(loginChoicePage.getBackOfficeButton()).toBeVisible();
        });
    });

    test('should display "Logout" button after login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Logout" button is visible on login-choice page', async () => {
            await expect(loginChoicePage.getLogoutButton()).toBeVisible();
        });
    });
});

// ============================================
// GROUP 5: NAVIGATION TESTS
// ============================================

test.describe('Login Page - Navigation', () => {

    test('should load the login page with correct URL', async ({ page }) => {
        await test.step('Verify current URL contains /backoffice/login', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
    });
});
