import { Page, Locator } from '@playwright/test';

export class ManageMediaPage {

    private page: Page;

    private pageHeading: Locator;
    private uploadButton: Locator;
    private mediaGrid: Locator;
    private noMediaMessage: Locator;
    private searchInput: Locator;
    private filterDropdown: Locator;

    constructor(page: Page) {
        this.page = page;

        this.pageHeading = page.getByRole('heading', { name: /Manage Media|Media/i });
        this.uploadButton = page.getByRole('button', { name: /Upload|Add Media|Add/i });
        this.mediaGrid = page.locator('[class*="grid"], [class*="media"], [class*="gallery"]').first();
        this.noMediaMessage = page.getByText(/No media|No files|No results/i);
        this.searchInput = page.getByPlaceholder(/search/i);
        this.filterDropdown = page.getByRole('combobox').first();
    }

    async goto() {
        await this.page.goto('/backoffice/manage-media');
    }

    async searchMedia(query: string) {
        await this.searchInput.fill(query);
        await this.page.waitForTimeout(2000);
    }

    getPageHeading() { return this.pageHeading; }
    getUploadButton() { return this.uploadButton; }
    getMediaGrid() { return this.mediaGrid; }
    getNoMediaMessage() { return this.noMediaMessage; }
    getSearchInput() { return this.searchInput; }
    getFilterDropdown() { return this.filterDropdown; }

    getMediaItems() {
        return this.page.locator('[class*="media-item"], [class*="card"], img');
    }

    getDeleteButtons() {
        return this.page.getByRole('button', { name: /Delete|Remove/i });
    }
}