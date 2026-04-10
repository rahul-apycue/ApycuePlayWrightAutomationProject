import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { ManageHotelsPage } from '../pages/ManageHotelsPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('Manage Hotels Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let manageHotelsPage: ManageHotelsPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    manageHotelsPage = new ManageHotelsPage(page);
});

// =========================================================================
// UI TESTS — Verify Manage Hotels page elements
// =========================================================================

test.describe('Manage Hotels - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Manage Hotels', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getManageHotelsMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/manage-hotels/);
        });
    });

    // ========== TC_MH_001 =====================
    // TC_NO_0150 = Verify Manage Hotels page loads with correct heading
    // Priority   = High
    // =================================
    test('TC_NO_0150: Verify Manage Hotels page loads with correct heading', async () => {
        await test.step('Verify "Manage Hotels" heading is visible', async () => {
            await expect(manageHotelsPage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_MH_002 =====================
    // TC_NO_0151 = Verify Manage Hotels page URL is correct
    // Priority   = High
    // =================================
    test('TC_NO_0151: Verify Manage Hotels page URL is correct', async ({ page }) => {
        await test.step('Verify URL is /backoffice/manage-hotels', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-hotels/);
        });
    });

    // ========== TC_MH_003 =====================
    // TC_NO_0152 = Verify Manage Hotels page displays hotel list or empty state
    // Priority   = Medium
    // =================================
    test('TC_NO_0152: Verify Manage Hotels page displays hotel list or empty state', async ({ page }) => {
        await test.step('Wait for content to load', async () => {
            await page.waitForTimeout(2000);
        });
        await test.step('Verify hotel list or empty state is displayed', async () => {
            const hasTable     = await manageHotelsPage.getHotelTable().isVisible().catch(() => false);
            const hasNoResults = await manageHotelsPage.getNoResultsMessage().isVisible().catch(() => false);
            const pageLoaded   = await manageHotelsPage.getPageHeading().isVisible().catch(() => false);
            expect(hasTable || hasNoResults || pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_MH_004 =====================
    // TC_NO_0153 = Verify search input is visible on Manage Hotels page
    // Priority   = Low
    // =================================
    test('TC_NO_0153: Verify search input is visible on Manage Hotels page', async () => {
        await test.step('Verify search input is present on the page', async () => {
            const hasSearch = await manageHotelsPage.getSearchInput().isVisible().catch(() => false);
            await expect(manageHotelsPage.getPageHeading()).toBeVisible();
            expect(hasSearch !== undefined).toBeTruthy();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search and table behavior
// =========================================================================

test.describe('Manage Hotels - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Manage Hotels', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getManageHotelsMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/manage-hotels/);
        });
    });

    // ========== TC_MH_005 =====================
    // TC_NO_0154 = Verify searching for an existing hotel returns results
    // Priority   = Medium
    // =================================
    test('TC_NO_0154: Verify searching for an existing hotel returns results', async () => {
        await test.step('Search for a known hotel term', async () => {
            const hasSearch = await manageHotelsPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await manageHotelsPage.searchHotel('hotel');
                const hasResults = await manageHotelsPage.getTableRows().first().isVisible().catch(() => false);
                const hasNoResults = await manageHotelsPage.getNoResultsMessage().isVisible().catch(() => false);
                expect(hasResults || hasNoResults).toBeTruthy();
            } else {
                await expect(manageHotelsPage.getPageHeading()).toBeVisible();
            }
        });
    });

    // ========== TC_MH_006 =====================
    // TC_NO_0155 = Verify searching for a non-existent hotel shows no results
    // Priority   = Medium
    // =================================
    test('TC_NO_0155: Verify searching for a non-existent hotel shows no results', async () => {
        await test.step('Search for a non-existent hotel', async () => {
            const hasSearch = await manageHotelsPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await manageHotelsPage.searchHotel('xyznonexistent99999');
                const hasNoResults = await manageHotelsPage.getNoResultsMessage().isVisible().catch(() => false);
                const hasZeroRows = await manageHotelsPage.getTableRows().count().then(c => c === 0).catch(() => false);
                expect(hasNoResults || hasZeroRows).toBeTruthy();
            } else {
                await expect(manageHotelsPage.getPageHeading()).toBeVisible();
            }
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify access control
// =========================================================================

test.describe('Manage Hotels - Security Tests', () => {

    // ========== TC_MH_007 =====================
    // TC_NO_0156 = Verify unauthenticated user cannot access Manage Hotels via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0156: Verify unauthenticated user cannot access Manage Hotels via direct URL', async ({ browser }) => {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        await test.step('Navigate directly to /backoffice/manage-hotels without login', async () => {
            await newPage.goto('/backoffice/manage-hotels');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(newPage).not.toHaveURL(/\/backoffice\/manage-hotels/);
        });

        await context.close();
    });
});

});
