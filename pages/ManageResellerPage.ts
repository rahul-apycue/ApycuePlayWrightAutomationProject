import { Page, Locator } from '@playwright/test';

export class ManageResellerPage {

    private page: Page;

    private pageHeading: Locator;
    private searchInput: Locator;
    private resellerTable: Locator;
    private addResellerButton: Locator;
    private noResultsMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /Manage Reseller|Resellers/i });
        this.searchInput = page.getByPlaceholder(/search/i);
        this.resellerTable = page.locator('table, [role="table"], [class*="table"]').first();
        this.addResellerButton = page.getByRole('button', { name: /Add|Create|New Reseller/i });
        this.noResultsMessage = page.getByText(/No resellers|No results|No data/i);
    }

    async goto() {
        await this.page.goto('/backoffice/manage-resellers');
    }

    async searchReseller(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    async clearSearch() {
        await this.searchInput.clear();
        await this.page.waitForTimeout(1000);
    }

    getPageHeading() { return this.pageHeading; }
    getSearchInput() { return this.searchInput; }
    getResellerTable() { return this.resellerTable; }
    getAddResellerButton() { return this.addResellerButton; }
    getNoResultsMessage() { return this.noResultsMessage; }

    getTableRows() {
        return this.page.locator('table tbody tr, [role="row"]');
    }

    getEditButtons() {
        return this.page.getByRole('button', { name: /Edit/i });
    }

    getDeleteButtons() {
        return this.page.getByRole('button', { name: /Delete|Remove/i });
    }
}