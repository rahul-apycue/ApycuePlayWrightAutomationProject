import { Page, Locator } from '@playwright/test';

export class UserManagementPage {

    private page: Page;

    private pageHeading: Locator;
    private searchInput: Locator;
    private userTable: Locator;
    private addUserButton: Locator;
    private noResultsMessage: Locator;
    private paginationNext: Locator;
    private paginationPrev: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /User Management|Users/i });
        this.searchInput = page.getByPlaceholder(/search/i);
        this.userTable = page.locator('table, [role="table"], [class*="table"]').first();
        this.addUserButton = page.getByRole('button', { name: /Add|Create|Invite|New User/i });
        this.noResultsMessage = page.getByText(/No users|No results|No data/i);
        this.paginationNext = page.getByRole('button', { name: /Next|>/i });
        this.paginationPrev = page.getByRole('button', { name: /Previous|Prev|</i });
    }

    async goto() {
        await this.page.goto('/backoffice/users');
    }

    async searchUser(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    async clearSearch() {
        await this.searchInput.clear();
        await this.page.waitForTimeout(1000);
    }

    getPageHeading() { return this.pageHeading; }
    getSearchInput() { return this.searchInput; }
    getUserTable() { return this.userTable; }
    getAddUserButton() { return this.addUserButton; }
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

    getRoleDropdowns() {
        return this.page.getByRole('combobox');
    }
}