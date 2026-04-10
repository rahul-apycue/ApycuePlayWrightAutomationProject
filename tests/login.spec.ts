import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;

test.describe('Login Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    await test.step('Navigate to Login page', async () => {
        await loginPage.goto();
    });
});

// =========================================================================
// UI TESTS — Verify that all elements are displayed correctly on the page
// =========================================================================

test.describe('UI Tests', () => {

    // ========== TC_BO_001 =====================
    // TC_NO_0001 = Verify that all login page elements (logo, heading, subtext, email, password, button, title) are displayed
    // Priority   = High
    // =================================
    test('TC_NO_0001: Verify that all login page elements are displayed correctly', async ({ page }) => {
        await test.step('Verify Apycue logo is visible', async () => {
            await expect(loginPage.getLogo()).toBeVisible();
        });
        await test.step('Verify Backoffice Login heading is visible', async () => {
            await expect(loginPage.getPageHeading()).toBeVisible();
        });
        await test.step('Verify subtext "Sign in to access your account" is visible', async () => {
            await expect(loginPage.getPageSubtext()).toBeVisible();
        });
        await test.step('Verify email input field is visible', async () => {
            await expect(loginPage.getEmailInput()).toBeVisible();
        });
        await test.step('Verify password input field is visible', async () => {
            await expect(loginPage.getPasswordInput()).toBeVisible();
        });
        await test.step('Verify Sign In button is visible and enabled', async () => {
            await expect(loginPage.getSignInButton()).toBeVisible();
            await expect(loginPage.getSignInButton()).toBeEnabled();
        });
        await test.step('Verify browser tab title contains "apycue"', async () => {
            await expect(page).toHaveTitle(/apycue/i);
        });
    });

    // ========== TC_BO_001 =====================
    // TC_NO_0002 = Verify that email and password fields have correct placeholder text and input types
    // Priority   = Medium
    // =================================
    test('TC_NO_0002: Verify that email and password fields have correct placeholder text and input types', async () => {
        await test.step('Verify email placeholder is "Enter your email"', async () => {
            await expect(loginPage.getEmailInput()).toHaveAttribute('placeholder', 'Enter your email');
        });
        await test.step('Verify password placeholder is "Enter your password"', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('placeholder', 'Enter your password');
        });
        await test.step('Verify email input type is "email"', async () => {
            await expect(loginPage.getEmailInput()).toHaveAttribute('type', 'email');
        });
    });

    // ========== TC_BO_001 =====================
    // TC_NO_0220 = Verify Email/Password labels and field icons are displayed correctly
    // Priority   = High
    // =================================
    test('TC_NO_0220: Verify label text and icons are displayed correctly on login form', async () => {
        await test.step('Verify Email and Password labels are visible with correct text', async () => {
            await expect(loginPage.getEmailLabel()).toBeVisible();
            await expect(loginPage.getEmailLabel()).toHaveText('Email');
            await expect(loginPage.getPasswordLabel()).toBeVisible();
            await expect(loginPage.getPasswordLabel()).toHaveText('Password');
        });
        await test.step('Verify mail, lock, and visibility icons are visible', async () => {
            await expect(loginPage.getEmailIcon()).toBeVisible();
            await expect(loginPage.getLockIcon()).toBeVisible();
            await expect(loginPage.getVisibilityIcon()).toBeVisible();
        });
    });

    // ========== TC_BO_001 =====================
    // TC_NO_0221 = Verify login page background gradient and card styling/alignment
    // Priority   = Medium
    // =================================
    test('TC_NO_0221: Verify login page background and card styling alignment', async ({ page }) => {
        await test.step('Verify gradient background container and login card are visible', async () => {
            await expect(loginPage.getPageGradient()).toBeVisible();
            await expect(loginPage.getLoginCard()).toBeVisible();
        });
        await test.step('Verify gradient background is applied and card has rounded style', async () => {
            const gradientBg = await loginPage.getPageGradient().evaluate(el => getComputedStyle(el).backgroundImage);
            const cardRadius = await loginPage.getLoginCard().evaluate(el => getComputedStyle(el).borderRadius);
            expect(gradientBg).not.toBe('none');
            expect(parseFloat(cardRadius)).toBeGreaterThan(0);
        });
        await test.step('Verify login card is horizontally centered on viewport', async () => {
            const box = await loginPage.getLoginCard().boundingBox();
            const viewport = page.viewportSize();
            expect(box).not.toBeNull();
            expect(viewport).not.toBeNull();
            if (box && viewport) {
                const cardCenter = box.x + box.width / 2;
                const viewportCenter = viewport.width / 2;
                expect(Math.abs(cardCenter - viewportCenter)).toBeLessThan(100);
            }
        });
    });

    // ========== TC_BO_002 =====================
    // TC_NO_0003 = Verify that all login-choice page elements are displayed after successful login
    // Priority   = High
    // =================================
    test('TC_NO_0003: Verify that all login-choice page elements are displayed after successful login', async () => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify "Login Successful" toast appears', async () => {
            await expect(loginChoicePage.getSuccessToast()).toBeVisible();
        });
        await test.step('Verify "Welcome back!" message appears', async () => {
            await expect(loginChoicePage.getWelcomeMessage()).toBeVisible();
        });
        await test.step('Verify "Select Login Type" heading is visible', async () => {
            await expect(loginChoicePage.getPageHeading()).toBeVisible();
        });
        await test.step('Verify "Choose where you want to login" subtext is visible', async () => {
            await expect(loginChoicePage.getPageSubtext()).toBeVisible();
        });
        await test.step('Verify "Hotel Login" button is visible', async () => {
            await expect(loginChoicePage.getHotelLoginButton()).toBeVisible();
        });
        await test.step('Verify "Back Office Login" button is visible', async () => {
            await expect(loginChoicePage.getBackOfficeButton()).toBeVisible();
        });
        await test.step('Verify "Logout" button is visible', async () => {
            await expect(loginChoicePage.getLogoutButton()).toBeVisible();
        });
    });

    // =================================
    // TC_NO_0004 = Verify that the login page loads with the correct URL
    // Priority   = Medium
    // =================================
    test('TC_NO_0004: Verify that the login page loads with the correct URL', async ({ page }) => {
        await test.step('Verify URL contains /backoffice/login', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login/);
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify that login features and validations work correctly
// =========================================================================

test.describe('Functional Tests', () => {

    // =================================
    // TC_NO_0005 = Verify that the user is able to type text in the email and password fields
    // Priority   = Medium
    // =================================
    test('TC_NO_0005: Verify that the user is able to type text in the email and password fields', async () => {
        await test.step('Type "test@example.com" in email field', async () => {
            await loginPage.fillEmail('test@example.com');
        });
        await test.step('Verify typed email is displayed in the field', async () => {
            await expect(loginPage.getEmailInput()).toHaveValue('test@example.com');
        });
        await test.step('Type "TestPassword123" in password field', async () => {
            await loginPage.fillPassword('TestPassword123');
        });
        await test.step('Verify typed password is stored in the field', async () => {
            await expect(loginPage.getPasswordInput()).toHaveValue('TestPassword123');
        });
    });

    // ========== TC_BO_005 =====================
    // TC_NO_0006 = Verify that the password field is masked and characters appear as dots
    // Priority   = High
    // =================================
    test('TC_NO_0006: Verify that the password field is masked and characters appear as dots', async () => {
        await test.step('Verify password input type is "password"', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'password');
        });
    });

    // ========== TC_BO_009 =====================
    // TC_NO_0007 = Verify that clicking the eye icon toggles password between hidden and visible
    // Priority   = Medium
    // =================================
    test('TC_NO_0007: Verify that clicking the eye icon toggles password between hidden and visible', async () => {
        await test.step('Type password in the password field', async () => {
            await loginPage.fillPassword('MySecret');
        });
        await test.step('Verify password is hidden by default', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'password');
        });
        await test.step('Click the eye icon to show password', async () => {
            await loginPage.togglePasswordVisibility();
        });
        await test.step('Verify password is now visible as plain text', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'text');
        });
        await test.step('Click the eye icon again to hide password', async () => {
            await loginPage.togglePasswordVisibility();
        });
        await test.step('Verify password is hidden again', async () => {
            await expect(loginPage.getPasswordInput()).toHaveAttribute('type', 'password');
        });
    });

    // ========== TC_BO_002 =====================
    // TC_NO_0008 = Verify that user is redirected to login-choice page after valid login
    // Priority   = Critical
    // =================================
    test('TC_NO_0008: Verify that user is redirected to login-choice page after valid login', async ({ page }) => {
        await test.step('Enter valid email', async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Enter valid password', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify URL changes to /backoffice/login-choice', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_BO_003 =====================
    // TC_NO_0009 = Verify that login fails when valid email and incorrect password are entered
    // Priority   = Critical
    // =================================
    test('TC_NO_0009: Verify that login fails when valid email and incorrect password are entered', async ({ page }) => {
        await test.step('Enter valid email', async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Enter incorrect password', async () => {
            await loginPage.fillPassword('WrongPassword@123');
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user remains on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    // ========== TC_BO_004 =====================
    // TC_NO_0010 = Verify that login fails when an unregistered email is entered
    // Priority   = High
    // =================================
    test('TC_NO_0010: Verify that login fails when an unregistered email is entered', async ({ page }) => {
        await test.step('Enter unregistered email', async () => {
            await loginPage.fillEmail('fakeemail@invalid.com');
        });
        await test.step('Enter valid password', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user remains on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    // ========== TC_BO_006 =====================
    // TC_NO_0011 = Verify that the password field is case-sensitive and rejects wrong case
    // Priority   = High
    // =================================
    test('TC_NO_0011: Verify that the password field is case-sensitive and rejects wrong case', async ({ page }) => {
        await test.step('Enter valid email', async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Enter password in uppercase', async () => {
            await loginPage.fillPassword(TEST_PASSWORD.toUpperCase());
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify login fails due to case mismatch', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    // =================================
    // TC_NO_0012 = Verify that login fails when both email and password are invalid
    // Priority   = High
    // =================================
    test('TC_NO_0012: Verify that login fails when both email and password are invalid', async ({ page }) => {
        await test.step('Enter invalid email', async () => {
            await loginPage.fillEmail('wrong@email.com');
        });
        await test.step('Enter invalid password', async () => {
            await loginPage.fillPassword('WrongPassword123');
        });
        await test.step('Click Sign In', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user remains on login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    // ========== TC_BO_007 =====================
    // TC_NO_0013 = Verify that login is blocked when mandatory fields are left empty
    // Priority   = Critical
    // =================================
    test('TC_NO_0013: Verify that login is blocked when mandatory fields are left empty', async ({ page }) => {
        await test.step('Click Sign In with both fields empty', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user remains on login page — both fields empty', async () => {
            await expect(page).toHaveURL(/\/login/);
        });

        await test.step('Reload login page for next scenario', async () => {
            await loginPage.goto();
        });

        await test.step('Enter valid email only', async () => {
            await loginPage.fillEmail(TEST_EMAIL);
        });
        await test.step('Click Sign In without entering password', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user remains on login page — password empty', async () => {
            await expect(page).toHaveURL(/\/login/);
        });

        await test.step('Reload login page for next scenario', async () => {
            await loginPage.goto();
        });

        await test.step('Enter valid password only', async () => {
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Click Sign In without entering email', async () => {
            await loginPage.clickSignIn();
        });
        await test.step('Verify user remains on login page — email empty', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    // ========== TC_BO_008 =====================
    // TC_NO_0014 = Verify that login is blocked when email format is invalid
    // Priority   = High
    // =================================
    test('TC_NO_0014: Verify that login is blocked when email format is invalid', async ({ page }) => {
        const invalidEmails = [
            { value: 'notanemail', reason: 'no @ symbol' },
            { value: 'test@', reason: 'missing domain' },
            { value: '@domain.com', reason: 'missing username' },
            { value: 'test@domain', reason: 'missing TLD' },
        ];

        for (const email of invalidEmails) {
            await test.step(`Enter invalid email: "${email.value}" (${email.reason})`, async () => {
                await loginPage.goto();
                await loginPage.fillEmail(email.value);
                await loginPage.fillPassword(TEST_PASSWORD);
                await loginPage.clickSignIn();
            });
            await test.step(`Verify user remains on login page for "${email.value}"`, async () => {
                await expect(page).toHaveURL(/\/login/);
            });
        }
    });

    // ========== TC_BO_012 =====================
    // TC_NO_0222 = Verify email value with leading/trailing spaces is handled correctly on submission
    // Priority   = Medium
    // =================================
    test('TC_NO_0222: Verify trimming behavior for leading and trailing spaces in Email field', async ({ page }) => {
        await test.step('Enter valid email with leading/trailing spaces and valid password', async () => {
            await loginPage.fillEmail(`  ${TEST_EMAIL}  `);
            await loginPage.fillPassword(TEST_PASSWORD);
            await loginPage.clickSignIn();
        });
        await test.step('Verify login succeeds with spaced email input', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_BO_012 =====================
    // TC_NO_0223 = Verify password field does not auto-trim intentional spaces
    // Priority   = Medium
    // =================================
    test('TC_NO_0223: Verify password field does not trim intentional spaces automatically', async () => {
        await test.step('Enter password with intentional leading/trailing spaces', async () => {
            await loginPage.fillPassword(`  ${TEST_PASSWORD}  `);
        });
        await test.step('Verify password input retains spaces exactly as entered', async () => {
            await expect(loginPage.getPasswordInput()).toHaveValue(`  ${TEST_PASSWORD}  `);
        });
    });

    // ========== TC_BO_013 =====================
    // TC_NO_0224 = Verify login form can be submitted using Enter key
    // Priority   = Medium
    // =================================
    test('TC_NO_0224: Verify login form submission using Enter key', async ({ page }) => {
        await test.step('Enter valid credentials', async () => {
            await loginPage.fillEmail(TEST_EMAIL);
            await loginPage.fillPassword(TEST_PASSWORD);
        });
        await test.step('Press Enter on password field', async () => {
            await loginPage.getPasswordInput().press('Enter');
        });
        await test.step('Verify user is redirected to login-choice page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_BO_014 =====================
    // TC_NO_0225 = Verify keyboard tab order and focus indicator on interactive controls
    // Priority   = Medium
    // =================================
    test('TC_NO_0225: Verify tab order and focus indicator across interactive elements', async ({ page }) => {
        await test.step('Verify tab progression is Email -> Password -> Sign In', async () => {
            await loginPage.getEmailInput().click();
            await expect(loginPage.getEmailInput()).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(loginPage.getPasswordInput()).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(loginPage.getSignInButton()).toBeFocused();
        });
        await test.step('Verify focused Sign In button has visible focus style', async () => {
            const focusShadow = await loginPage.getSignInButton().evaluate(el => getComputedStyle(el).boxShadow);
            expect(focusShadow).not.toBe('none');
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify URL bypass protection and session management
// =========================================================================

test.describe('Security Tests', () => {

    // ========== TC_BO_010 =====================
    // TC_NO_0015 = Verify that user is redirected to login page when accessing login-choice URL directly without session
    // Priority   = Critical
    // =================================
    test('TC_NO_0015: Verify that user is redirected to login page when accessing login-choice URL directly without session', async ({ page }) => {
        await test.step('Open login-choice page directly without logging in', async () => {
            await page.goto('/backoffice/login-choice');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(page).toHaveURL(/\/login/);
        });
    });

    // ========== TC_BO_011 =====================
    // TC_NO_0016 = Verify that user session is maintained after clicking browser back and forward buttons
    // Priority   = High
    // =================================
    test('TC_NO_0016: Verify that user session is maintained after clicking browser back and forward buttons', async ({ page }) => {
        await test.step('Login with valid credentials', async () => {
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
        });
        await test.step('Verify user is on login-choice page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
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
});

});
