/**
 * LoginPage - Page Object Model (POM) for the Apycue Backoffice Login page.
 *
 * WHY THIS FILE EXISTS:
 * Instead of writing selectors (like #email, #password) directly in every test,
 * we define them HERE once. If the website changes a button or input,
 * we only fix it in this ONE file — not in 50 test files.
 *
 * HOW IT WORKS:
 * 1. LOCATORS  → Find elements on the page (like email input, password input, button)
 * 2. ACTIONS   → Do something on the page (like type email, click Sign In)
 * 3. GETTERS   → Return elements so test files can check them (is it visible? is it enabled?)
 */

import { Page, Locator } from '@playwright/test';
// Page   → Represents the browser tab (used to navigate, click, type, etc.)
// Locator → Represents a single element on the page (like an input box or button)

export class LoginPage {

    // "private" means only this class can use these variables — keeps things clean
    private page: Page;

    // =============================================
    // LOCATORS — Define all page elements here
    // Think of these as "pointers" to elements on the page
    // =============================================
    private emailInput: Locator;       // The email text box
    private passwordInput: Locator;    // The password text box
    private signInButton: Locator;     // The "Sign In" button
    private passwordToggle: Locator;   // The eye icon to show/hide password
    private pageHeading: Locator;      // The "Backoffice Login" title text
    private pageSubtext: Locator;      // The "Sign in to access your account" text
    private logo: Locator;             // The Apycue logo image

    /**
     * CONSTRUCTOR — Runs automatically when you write: new LoginPage(page)
     *
     * It takes the browser "page" and finds all the elements we need.
     * We do this ONCE here, so every test can reuse them.
     */
    constructor(page: Page) {
        this.page = page;

        // Finding elements using different Playwright strategies:

        // Strategy 1: By ID → page.locator('#id')
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');

        // Strategy 2: By Role → page.getByRole('button', { name: 'Sign In' })
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.pageHeading = page.getByRole('heading', { name: 'Backoffice Login' });

        // Strategy 3: By CSS Selector → page.locator('css-selector')
        this.passwordToggle = page.locator('#password ~ div span.material-symbols-outlined');

        // Strategy 4: By Text → page.getByText('some text')
        this.pageSubtext = page.getByText('Sign in to access your account');

        // Strategy 5: By Alt Text → page.getByAltText('alt text')
        this.logo = page.getByAltText('Apycue Logo');
    }

    // =============================================
    // ACTIONS — Things you can DO on the login page
    // =============================================

    /**
     * Open the login page in the browser.
     *
     * BEFORE (hardcoded):  page.goto('https://apycue-staging.web.app/backoffice/login')
     * NOW (from config):   page.goto('/backoffice/login')
     *
     * Playwright automatically adds BASE_URL from .env file in front.
     * So '/backoffice/login' becomes 'https://apycue-staging.web.app/backoffice/login'
     */
    async goto() {
        await this.page.goto('/backoffice/login');
    }

    /** Type an email into the email input box */
    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    /** Type a password into the password input box */
    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    /** Click the "Sign In" button */
    async clickSignIn() {
        await this.signInButton.click();
    }

    /**
     * Complete login in one step — fills email, password, and clicks Sign In.
     * This is a shortcut so tests don't have to call 3 methods every time.
     */
    async login(email: string, password: string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickSignIn();
    }

    /** Click the eye icon to show/hide the password */
    async togglePasswordVisibility() {
        await this.passwordToggle.click();
    }

    // =============================================
    // GETTERS — Return elements so test files can CHECK them
    // =============================================

    getEmailInput() {
        return this.emailInput;
    }

    getPasswordInput() {
        return this.passwordInput;
    }

    getSignInButton() {
        return this.signInButton;
    }

    getPageHeading() {
        return this.pageHeading;
    }

    getPageSubtext() {
        return this.pageSubtext;
    }

    getLogo() {
        return this.logo;
    }
}
