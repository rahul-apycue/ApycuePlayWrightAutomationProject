import { Page, Locator } from '@playwright/test';

export class HotelGoogleSearchPage {

    private page: Page;

    private searchHotelHeading: Locator;
    private searchSubtext: Locator;
    private searchInput: Locator;
    private searchButton: Locator;
    private backToTenantButton: Locator;
    private tenantBadge: Locator;
    private skipCreateManuallyButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.searchHotelHeading = page.getByRole('heading', { name: 'Search Hotel' });
        this.searchSubtext = page.getByText('Find your hotel on Google to auto-fill details, or create manually');
        this.searchInput = page.getByPlaceholder('Search hotel name or location...');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.backToTenantButton = page.getByRole('button', { name: 'Back to Tenant Selection' });
        this.tenantBadge = page.locator('.rounded-full').filter({ hasText: 'Tenant:' });
        this.skipCreateManuallyButton = page.getByRole('button', { name: /Skip\s*&\s*Create Manually|Create Hotel Manually/i });
    }

    async searchHotel(query: string) {
        await this.searchInput.fill(query);
        await this.searchButton.click();
        await this.page.waitForTimeout(3000);
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async clickBackToTenant() {
        await this.backToTenantButton.click();
    }

    async clickSkipCreateManually() {
        await this.skipCreateManuallyButton.click();
    }

    getSearchHotelHeading() {
        return this.searchHotelHeading;
    }

    getSearchSubtext() {
        return this.searchSubtext;
    }

    getSearchInput() {
        return this.searchInput;
    }

    getSearchButton() {
        return this.searchButton;
    }

    getBackToTenantButton() {
        return this.backToTenantButton;
    }

    getTenantBadge() {
        return this.tenantBadge;
    }

    getSkipCreateManuallyButton() {
        return this.skipCreateManuallyButton;
    }

    getResultsCount() {
        return this.page.getByText(/Found \d+ hotel/);
    }

    getHotelCards() {
        return this.page.locator('.rounded-lg.group.cursor-pointer');
    }

    getSelectButtons() {
        return this.page.locator('.rounded-lg.group.cursor-pointer button:has-text("Select")');
    }

    getHotelName(index: number) {
        return this.getHotelCards().nth(index).locator('h4');
    }

    getHotelLocation(index: number) {
        return this.getHotelCards().nth(index).locator('text=location_on').locator('..');
    }
}
