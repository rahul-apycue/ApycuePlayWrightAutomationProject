import { Page, Locator } from '@playwright/test';

export class DashboardPage {

    private page: Page;

    private welcomeHeading: Locator;
    private dashboardSubtext: Locator;
    private backButton: Locator;
    private profileButton: Locator;

    // Profile hover card popup elements
    private profileName: Locator;
    private profileLogoutButton: Locator;

    // Sidebar menu items (Admin)
    private createHotelMenu: Locator;
    private manageHotelsMenu: Locator;
    private userManagementMenu: Locator;
    private manageResellerMenu: Locator;
    private whiteLabelPartnerMenu: Locator;
    private viewHotelMenu: Locator;
    private manageMediaMenu: Locator;
    private taskStatusMenu: Locator;
    private dataDiscoveryMenu: Locator;

    constructor(page: Page) {
        this.page = page;

        this.welcomeHeading = page.getByRole('heading', { name: /Welcome back/i });
        this.dashboardSubtext = page.getByText('Backoffice Administration Dashboard');
        this.backButton = page.locator('button:has(span:text("arrow_back"))');
        this.profileButton = page.locator('button[data-slot="hover-card-trigger"]');

        this.profileName = page.getByText('Backoffice Admin', { exact: true });
        this.profileLogoutButton = page.getByRole('button', { name: 'Logout' });

        this.createHotelMenu = page.getByRole('link', { name: 'Create Hotel' });
        this.manageHotelsMenu = page.getByRole('link', { name: 'Manage Hotels' });
        this.userManagementMenu = page.getByRole('link', { name: 'User Management' });
        this.manageResellerMenu = page.getByRole('link', { name: 'Manage Reseller' });
        this.whiteLabelPartnerMenu = page.getByRole('link', { name: 'White Label Partner' });
        this.viewHotelMenu = page.getByRole('link', { name: 'View Hotel' });
        this.manageMediaMenu = page.getByRole('link', { name: 'Manage Media' });
        this.taskStatusMenu = page.getByRole('link', { name: 'Task Status' });
        this.dataDiscoveryMenu = page.getByRole('link', { name: 'Data Discovery' });
    }

    async goto() {
        await this.page.goto('/backoffice/create-hotel');
    }

    async clickCreateHotel() {
        await this.createHotelMenu.click();
    }

    async clickBackButton() {
        await this.backButton.click();
    }

    async hoverProfileButton() {
        await this.profileButton.hover();
    }

    getWelcomeHeading() {
        return this.welcomeHeading;
    }

    getDashboardSubtext() {
        return this.dashboardSubtext;
    }

    getBackButton() {
        return this.backButton;
    }

    getProfileButton() {
        return this.profileButton;
    }

    getProfileName() {
        return this.profileName;
    }

    getProfileLogoutButton() {
        return this.profileLogoutButton;
    }

    getCreateHotelMenu() {
        return this.createHotelMenu;
    }

    getManageHotelsMenu() {
        return this.manageHotelsMenu;
    }

    getUserManagementMenu() {
        return this.userManagementMenu;
    }

    getManageResellerMenu() {
        return this.manageResellerMenu;
    }

    getWhiteLabelPartnerMenu() {
        return this.whiteLabelPartnerMenu;
    }

    getViewHotelMenu() {
        return this.viewHotelMenu;
    }

    getManageMediaMenu() {
        return this.manageMediaMenu;
    }

    getTaskStatusMenu() {
        return this.taskStatusMenu;
    }

    getDataDiscoveryMenu() {
        return this.dataDiscoveryMenu;
    }

    getAllAdminMenuItems() {
        return [
            this.createHotelMenu,
            this.manageHotelsMenu,
            this.userManagementMenu,
            this.manageResellerMenu,
            this.whiteLabelPartnerMenu,
            this.viewHotelMenu,
            this.manageMediaMenu,
            this.taskStatusMenu,
        ];
    }
}
