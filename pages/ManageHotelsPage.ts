import { Page, Locator } from '@playwright/test';

export class ManageHotelsPage {

    private page: Page;

    private pageHeading: Locator;
    private searchInput: Locator;
    private hotelTable: Locator;
    private addHotelButton: Locator;
    private noResultsMessage: Locator;
    private paginationNext: Locator;
    private paginationPrev: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /Manage Hotels/i });
        this.searchInput = page.getByPlaceholder(/search/i);
        this.hotelTable = page.locator('table, [role="table"], [class*="table"]').first();
        this.addHotelButton = page.getByRole('button', { name: /Add|Create|New Hotel/i });
        this.noResultsMessage = page.getByText(/No hotels|No results|No data/i);
        this.paginationNext = page.getByRole('button', { name: /Next|>/i });
        this.paginationPrev = page.getByRole('button', { name: /Previous|Prev|</i });
    }

    async goto() {
        await this.page.goto('/backoffice/manage-hotels');
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
    getHotelTable() { return this.hotelTable; }
    getAddHotelButton() { return this.addHotelButton; }
    getNoResultsMessage() { return this.noResultsMessage; }
    getPaginationNext() { return this.paginationNext; }
    getPaginationPrev() { return this.paginationPrev; }

    getTableRows() {
        return this.page.locator('table tbody tr, [role="row"]');
    }

    getEditButtons() {
        return this.page.getByRole('button', { name: /Edit/i });
    }

    getDeleteButtons() {
        return this.page.getByRole('button', { name: /Delete|Remove/i });
    }

    getViewButtons() {
        return this.page.getByRole('button', { name: /View|Details/i });
    }

    getResultsCount() {
        return this.page.getByText(/total|showing|results/i).first();
    }
}