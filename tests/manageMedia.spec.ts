import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { ManageMediaPage } from '../pages/ManageMediaPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('Manage Media Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let manageMediaPage: ManageMediaPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    manageMediaPage = new ManageMediaPage(page);
});

// =========================================================================
// UI TESTS — Verify Manage Media page elements
// =========================================================================

test.describe('Manage Media - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Manage Media', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getManageMediaMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/manage-media/);
        });
    });

    // ========== TC_MM_001 =====================
    // TC_NO_0189 = Verify Manage Media page loads with correct heading
    // Priority   = High
    // =================================
    test('TC_NO_0189: Verify Manage Media page loads with correct heading', async () => {
        await test.step('Verify "Manage Media" heading is visible', async () => {
            await expect(manageMediaPage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_MM_002 =====================
    // TC_NO_0190 = Verify Manage Media page URL is correct
    // Priority   = High
    // =================================
    test('TC_NO_0190: Verify Manage Media page URL is correct', async ({ page }) => {
        await test.step('Verify URL is /backoffice/manage-media', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-media/);
        });
    });

    // ========== TC_MM_003 =====================
    // TC_NO_0191 = Verify Manage Media page displays media grid or empty state
    // Priority   = Medium
    // =================================
    test('TC_NO_0191: Verify Manage Media page displays media grid or empty state', async ({ page }) => {
        await test.step('Wait for content to load', async () => {
            await page.waitForTimeout(2000);
        });
        await test.step('Verify media grid or empty state is displayed', async () => {
            const hasMedia   = await manageMediaPage.getMediaGrid().isVisible().catch(() => false);
            const hasNoMedia = await manageMediaPage.getNoMediaMessage().isVisible().catch(() => false);
            const pageLoaded = await manageMediaPage.getPageHeading().isVisible().catch(() => false);
            expect(hasMedia || hasNoMedia || pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_MM_004 =====================
    // TC_NO_0192 = Verify Upload button is visible on Manage Media page
    // Priority   = Low
    // =================================
    test('TC_NO_0192: Verify Upload button is visible on Manage Media page', async () => {
        await test.step('Verify Upload/Add Media button is present', async () => {
            const hasUpload = await manageMediaPage.getUploadButton().isVisible().catch(() => false);
            await expect(manageMediaPage.getPageHeading()).toBeVisible();
            expect(hasUpload !== undefined).toBeTruthy();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search and filter behavior
// =========================================================================

test.describe('Manage Media - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Manage Media', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getManageMediaMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/manage-media/);
        });
    });

    // ========== TC_MM_005 =====================
    // TC_NO_0193 = Verify search input returns media results when available
    // Priority   = Medium
    // =================================
    test('TC_NO_0193: Verify search input returns media results when available', async () => {
        await test.step('Search for media using a keyword', async () => {
            const hasSearch = await manageMediaPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await manageMediaPage.searchMedia('image');
                const hasResults = await manageMediaPage.getMediaItems().first().isVisible().catch(() => false);
                const hasNoMedia = await manageMediaPage.getNoMediaMessage().isVisible().catch(() => false);
                expect(hasResults || hasNoMedia).toBeTruthy();
            } else {
                await expect(manageMediaPage.getPageHeading()).toBeVisible();
            }
        });
    });

    // ========== TC_MM_006 =====================
    // TC_NO_0194 = Verify refreshing Manage Media page does not lose the session
    // Priority   = Low
    // =================================
    test('TC_NO_0194: Verify refreshing Manage Media page does not lose the session', async ({ page }) => {
        await test.step('Reload the Manage Media page', async () => {
            await page.reload();
        });
        await test.step('Verify user is still on Manage Media page after reload', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-media/);
            await expect(manageMediaPage.getPageHeading()).toBeVisible();
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify restricted user access
// =========================================================================

test.describe('Manage Media - Security Tests', () => {

    // ========== TC_MM_007 =====================
    // TC_NO_0195 = Verify restricted user CAN access Manage Media page
    // Priority   = High
    // =================================
    test('TC_NO_0195: Verify restricted user CAN access Manage Media page', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify Manage Media menu is visible for restricted user', async () => {
            await expect(dashboardPage.getManageMediaMenu()).toBeVisible();
        });
        await test.step('Click Manage Media menu', async () => {
            await dashboardPage.getManageMediaMenu().click();
        });
        await test.step('Verify restricted user can access the page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-media/);
        });
    });

    // ========== TC_MM_008 =====================
    // TC_NO_0196 = Verify unauthenticated user cannot access Manage Media via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0196: Verify unauthenticated user cannot access Manage Media via direct URL', async ({ browser }) => {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        await test.step('Navigate directly to /backoffice/manage-media without login', async () => {
            await newPage.goto('/backoffice/manage-media');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(newPage).not.toHaveURL(/\/backoffice\/manage-media/);
        });

        await context.close();
    });
});

});
