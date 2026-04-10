import { Page, Locator } from '@playwright/test';

export class CreateHotelPage {

    private page: Page;

    private pageHeading: Locator;
    private pageSubtext: Locator;
    private searchHeading: Locator;
    private searchSubtext: Locator;
    private searchInput: Locator;
    private searchInputIcon: Locator;
    private searchSectionDivider: Locator;
    private tenantSearchCard: Locator;
    private mainContent: Locator;
    private createHotelSidebarMenu: Locator;
    private createNewTenantButton: Locator;
    private supportText: Locator;
    private createNewTenantHeading: Locator;
    private createNewTenantSubtext: Locator;
    private tenantNameLabel: Locator;
    private tenantNameInput: Locator;
    private tenantNameIcon: Locator;
    private businessTypeLabel: Locator;
    private businessTypeCombobox: Locator;
    private cancelButton: Locator;
    private createTenantButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: 'Create Hotel' });
        this.pageSubtext = page.getByText('Search for existing tenant or create a new one');
        this.searchHeading = page.getByRole('heading', { name: 'Search for Tenant' });
        this.searchSubtext = page.getByText('Search by tenant name, hotel code, or hotel name');
        this.searchInput = page.getByPlaceholder('Enter tenant name...');
        this.searchInputIcon = page
            .locator('[data-slot="input-group"]')
            .filter({ has: this.searchInput })
            .first()
            .locator('span.material-symbols-outlined', { hasText: /^search$/ });
        this.searchSectionDivider = page.locator('hr').first();
        this.tenantSearchCard = page.locator('div.rounded-lg.border.bg-card.text-card-foreground.shadow-sm').first();
        this.mainContent = page.locator('main').first();
        this.createHotelSidebarMenu = page.locator('a[href="/backoffice/create-hotel"]').first();
        this.createNewTenantButton = page.getByRole('button', { name: 'Create New Tenant' });
        this.supportText = page.getByText('Need help? Contact support at support@apycue.com');
        this.createNewTenantHeading = page.getByRole('heading', { name: /Create New Tenant|New Tenant/i });
        this.createNewTenantSubtext = page.getByText('Register a new business to the platform');
        this.tenantNameLabel = page.getByText('Tenant Name *');
        this.tenantNameInput = page.getByLabel(/Tenant Name|Name/i).first();
        this.tenantNameIcon = page
            .locator('[data-slot="input-group"]')
            .filter({ has: page.getByPlaceholder('Enter business name') })
            .first()
            .locator('span.material-symbols-outlined', { hasText: /^apartment$/ });
        this.businessTypeLabel = page.getByText('Business Type *');
        this.businessTypeCombobox = page.getByRole('combobox').filter({ hasText: /Select business type/i }).first();
        this.cancelButton = page.getByRole('button', { name: /Cancel/i });
        this.createTenantButton = page.getByRole('button', { name: /Create Tenant/i });
    }

    async goto() {
        await this.page.goto('/backoffice/create-hotel');
    }

    async searchTenant(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async clickCreateNewTenant() {
        await this.createNewTenantButton.click();
    }

    getPageHeading() {
        return this.pageHeading;
    }

    getPageSubtext() {
        return this.pageSubtext;
    }

    getSearchHeading() {
        return this.searchHeading;
    }

    getSearchSubtext() {
        return this.searchSubtext;
    }

    getSearchInput() {
        return this.searchInput;
    }

    getSearchInputIcon() {
        return this.searchInputIcon;
    }

    getSearchSectionDivider() {
        return this.searchSectionDivider;
    }

    getTenantSearchCard() {
        return this.tenantSearchCard;
    }

    getMainContent() {
        return this.mainContent;
    }

    getCreateHotelSidebarMenu() {
        return this.createHotelSidebarMenu;
    }

    getCreateNewTenantButton() {
        return this.createNewTenantButton;
    }

    getSupportText() {
        return this.supportText;
    }

    getCreateNewTenantHeading() {
        return this.createNewTenantHeading;
    }

    getCreateNewTenantSubtext() {
        return this.createNewTenantSubtext;
    }

    getTenantNameLabel() {
        return this.tenantNameLabel;
    }

    getTenantNameInput() {
        return this.tenantNameInput;
    }

    getTenantNameIcon() {
        return this.tenantNameIcon;
    }

    getBusinessTypeLabel() {
        return this.businessTypeLabel;
    }

    getBusinessTypeCombobox() {
        return this.businessTypeCombobox;
    }

    getCancelButton() {
        return this.cancelButton;
    }

    getCreateTenantButton() {
        return this.createTenantButton;
    }

    getSearchResultsCount() {
        return this.page.getByText(/Found \d+ tenant/);
    }

    getSearchResults() {
        return this.page.getByRole('button', { name: 'Select' });
    }

    getFirstResultName() {
        return this.page.locator('.rounded-lg, [class*="border"]').filter({ hasText: 'Select' }).first();
    }

    getNoResultsMessage() {
        return this.page.getByText(/No tenant|no result/i);
    }
}
