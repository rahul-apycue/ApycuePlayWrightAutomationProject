/**
 * LoginChoicePage - Page Object for the "Select Login Type" page.
 *
 * This page appears AFTER a successful login.
 * URL: /backoffice/login-choice
 *
 * It shows 3 options:
 *   1. Hotel Login       → Navigate to hotel dashboard
 *   2. Back Office Login → Navigate to backoffice dashboard
 *   3. Logout            → Log out and go back to login page
 *
 * It also shows a success toast: "Login Successful" / "Welcome back!"
 */

import { Page, Locator } from '@playwright/test';

export class LoginChoicePage {

    private page: Page;

    // =============================================
    // LOCATORS — All elements on the Login Choice page
    // =============================================
    private pageHeading: Locator;        // "Select Login Type" heading
    private pageSubtext: Locator;        // "Choose where you want to login" text
    private hotelLoginButton: Locator;   // "Hotel Login" button
    private backOfficeButton: Locator;   // "Back Office Login" button
    private logoutButton: Locator;       // "Logout" button
    private successToast: Locator;       // "Login Successful" toast notification
    private welcomeMessage: Locator;     // "Welcome back!" toast description

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByText('Select Login Type');
        this.pageSubtext = page.getByText('Choose where you want to login');
        this.hotelLoginButton = page.getByRole('button', { name: 'Hotel Login' });
        this.backOfficeButton = page.getByRole('button', { name: 'Back Office Login' });
        this.logoutButton = page.getByRole('button', { name: 'Logout' });
        this.successToast = page.getByText('Login Successful');
        this.welcomeMessage = page.getByText('Welcome back!');
    }

    // =============================================
    // ACTIONS — Things you can DO on this page
    // =============================================

    /** Click the "Hotel Login" button */
    async clickHotelLogin() {
        await this.hotelLoginButton.click();
    }

    /** Click the "Back Office Login" button */
    async clickBackOfficeLogin() {
        await this.backOfficeButton.click();
    }

    /** Click the "Logout" button */
    async clickLogout() {
        await this.logoutButton.click();
    }

    // =============================================
    // GETTERS — Return elements so test files can CHECK them
    // =============================================

    getPageHeading() {
        return this.pageHeading;
    }

    getPageSubtext() {
        return this.pageSubtext;
    }

    getHotelLoginButton() {
        return this.hotelLoginButton;
    }

    getBackOfficeButton() {
        return this.backOfficeButton;
    }

    getLogoutButton() {
        return this.logoutButton;
    }

    getSuccessToast() {
        return this.successToast;
    }

    getWelcomeMessage() {
        return this.welcomeMessage;
    }
}
