import { Page, Locator } from '@playwright/test';

export class ViewHotelPage {

    private page: Page;

    private pageHeading: Locator;
    private searchInput: Locator;
    private hotelList: Locator;
    private noResultsMessage: Locator;
    private filterDropdown: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /View Hotel|Hotels/i });
        this.searchInput = page.getByPlaceholder(/search/i);
        this.hotelList = page.locator('[class*="card"], [class*="hotel-item"], table').first();
        this.noResultsMessage = page.getByText(/No hotels|No results|No data/i);
        this.filterDropdown = page.getByRole('combobox').first();
    }

    async goto() {
        await this.page.goto('/backoffice/view-hotel');
    }

    async searchHotel(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    async clearSearch() {
        await this.searchInput.clear();
        await this.page.waitForTimeout(1000);
    }

    getPageHeading() { return this.pageHeading; }
    getSearchInput() { return this.searchInput; }
    getHotelList() { return this.hotelList; }
    getNoResultsMessage() { return this.noResultsMessage; }
    getFilterDropdown() { return this.filterDropdown; }

    getHotelCards() {
        return this.page.locator('[class*="card"], [class*="hotel"]');
    }

    getViewDetailsButtons() {
        return this.page.getByRole('button', { name: /View|Details|Open/i });
    }
}