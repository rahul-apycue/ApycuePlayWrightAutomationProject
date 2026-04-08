import { Page, Locator } from '@playwright/test';

export class LoginChoicePage {

    private page: Page;

    private pageHeading: Locator;
    private pageSubtext: Locator;
    private hotelLoginButton: Locator;
    private backOfficeButton: Locator;
    private logoutButton: Locator;
    private successToast: Locator;
    private welcomeMessage: Locator;

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

    async goto() {
        await this.page.goto('/backoffice/login-choice');
    }

    async clickHotelLogin() {
        await this.hotelLoginButton.click();
    }

    async clickBackOfficeLogin() {
        await this.backOfficeButton.click();
    }

    async clickLogout() {
        await this.logoutButton.click();
    }

    getPage() {
        return this.page;
    }

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
