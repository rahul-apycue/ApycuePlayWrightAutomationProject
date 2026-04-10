import { Page, Locator } from '@playwright/test';

export class TaskStatusPage {

    private page: Page;

    private pageHeading: Locator;
    private taskTable: Locator;
    private noTasksMessage: Locator;
    private statusFilterDropdown: Locator;
    private searchInput: Locator;
    private refreshButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /Task Status|Tasks/i });
        this.taskTable = page.locator('table, [role="table"], [class*="table"]').first();
        this.noTasksMessage = page.getByText(/No tasks|No results|No data/i);
        this.statusFilterDropdown = page.getByRole('combobox').first();
        this.searchInput = page.getByPlaceholder(/search/i);
        this.refreshButton = page.getByRole('button', { name: /Refresh|Reload/i });
    }

    async goto() {
        await this.page.goto('/backoffice/task-status');
    }

    async filterByStatus(status: string) {
        await this.statusFilterDropdown.click();
        await this.page.getByRole('option', { name: status }).click();
        await this.page.waitForTimeout(1000);
    }

    getPageHeading() { return this.pageHeading; }
    getTaskTable() { return this.taskTable; }
    getNoTasksMessage() { return this.noTasksMessage; }
    getStatusFilterDropdown() { return this.statusFilterDropdown; }
    getSearchInput() { return this.searchInput; }
    getRefreshButton() { return this.refreshButton; }

    getTableRows() {
        return this.page.locator('table tbody tr, [role="row"]');
    }

    getStatusBadges() {
        return this.page.locator('[class*="badge"], [class*="status"], [class*="chip"]');
    }

    getRetryButtons() {
        return this.page.getByRole('button', { name: /Retry|Rerun/i });
    }
}