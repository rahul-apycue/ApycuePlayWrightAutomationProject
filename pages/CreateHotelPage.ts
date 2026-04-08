import { Page, Locator } from '@playwright/test';

export class CreateHotelPage {

    private page: Page;

    private pageHeading: Locator;
    private pageSubtext: Locator;
    private searchHeading: Locator;
    private searchSubtext: Locator;
    private searchInput: Locator;
    private createNewTenantButton: Locator;
    private supportText: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: 'Create Hotel' });
        this.pageSubtext = page.getByText('Search for existing tenant or create a new one');
        this.searchHeading = page.getByRole('heading', { name: 'Search for Tenant' });
        this.searchSubtext = page.getByText('Search by tenant name, hotel code, or hotel name');
        this.searchInput = page.getByPlaceholder('Enter tenant name...');
        this.createNewTenantButton = page.getByRole('button', { name: 'Create New Tenant' });
        this.supportText = page.getByText('Need help? Contact support at support@apycue.com');
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

    getCreateNewTenantButton() {
        return this.createNewTenantButton;
    }

    getSupportText() {
        return this.supportText;
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
