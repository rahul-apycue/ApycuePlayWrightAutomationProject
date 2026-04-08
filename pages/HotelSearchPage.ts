import { Page, Locator } from '@playwright/test';

export class HotelSearchPage {

    private page: Page;

    private pageHeading: Locator;
    private pageSubtext: Locator;
    private searchInput: Locator;
    private backButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByText('Hotel Login');
        this.pageSubtext = page.getByText('Search and click on a hotel to login instantly');
        this.searchInput = page.getByPlaceholder('Search by name, code, or city...');
        this.backButton = page.getByRole('button', { name: 'Back' });
    }

    async searchHotel(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    async clearSearch() {
        await this.searchInput.clear();
    }

    async clickBackButton() {
        await this.backButton.click();
    }

    getPageHeading() {
        return this.pageHeading;
    }

    getPageSubtext() {
        return this.pageSubtext;
    }

    getSearchInput() {
        return this.searchInput;
    }

    getBackButton() {
        return this.backButton;
    }

    getSearchResults() {
        return this.page.locator('[class*="rounded-lg border"]').filter({ hasText: /Hotel Code/ });
    }

    getNoResultsMessage() {
        return this.page.getByText('No hotels found');
    }
}
