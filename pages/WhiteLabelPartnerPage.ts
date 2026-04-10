import { Page, Locator } from '@playwright/test';

export class WhiteLabelPartnerPage {

    private page: Page;

    private pageHeading: Locator;
    private searchInput: Locator;
    private partnerTable: Locator;
    private addPartnerButton: Locator;
    private noResultsMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /Manage White Labels|White Label Partner|Partners/i });
        this.searchInput = page.getByRole('textbox', { name: /Search/i }).first();
        this.partnerTable = page.locator('table, [role="table"], [class*="table"]').first();
        this.addPartnerButton = page.getByRole('button', { name: /Add|Create|New Partner/i });
        this.noResultsMessage = page.getByText(/No partners|No results|No data/i);
    }

    async goto() {
        await this.page.goto('/backoffice/white-labels');
    }

    async searchPartner(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    async clearSearch() {
        await this.searchInput.clear();
        await this.page.waitForTimeout(1000);
    }

    getPageHeading() { return this.pageHeading; }
    getSearchInput() { return this.searchInput; }
    getPartnerTable() { return this.partnerTable; }
    getAddPartnerButton() { return this.addPartnerButton; }
    getNoResultsMessage() { return this.noResultsMessage; }

    getTableRows() {
        return this.page.locator('table tbody tr, [role="row"]');
    }

    getEditButtons() {
        return this.page.getByRole('button', { name: /Edit/i });
    }
}
