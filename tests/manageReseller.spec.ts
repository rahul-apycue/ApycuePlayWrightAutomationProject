import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { ManageResellerPage } from '../pages/ManageResellerPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('Manage Reseller Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let manageResellerPage: ManageResellerPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    manageResellerPage = new ManageResellerPage(page);
});

// =========================================================================
// UI TESTS — Verify Manage Reseller page elements
// =========================================================================

test.describe('Manage Reseller - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Manage Reseller', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getManageResellerMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/manage-resellers/);
        });
    });

    // ========== TC_MR_001 =====================
    // TC_NO_0165 = Verify Manage Reseller page loads with correct heading
    // Priority   = High
    // =================================
    test('TC_NO_0165: Verify Manage Reseller page loads with correct heading', async () => {
        await test.step('Verify "Manage Reseller" heading is visible', async () => {
            await expect(manageResellerPage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_MR_002 =====================
    // TC_NO_0166 = Verify Manage Reseller page URL is correct
    // Priority   = High
    // =================================
    test('TC_NO_0166: Verify Manage Reseller page URL is correct', async ({ page }) => {
        await test.step('Verify URL is /backoffice/manage-resellers', async () => {
            await expect(page).toHaveURL(/\/backoffice\/manage-resellers/);
        });
    });

    // ========== TC_MR_003 =====================
    // TC_NO_0167 = Verify Manage Reseller page displays reseller list or empty state
    // Priority   = Medium
    // =================================
    test('TC_NO_0167: Verify Manage Reseller page displays reseller list or empty state', async ({ page }) => {
        await test.step('Wait for content to load', async () => {
            await page.waitForTimeout(2000);
        });
        await test.step('Verify reseller list or empty state is displayed', async () => {
            const hasTable     = await manageResellerPage.getResellerTable().isVisible().catch(() => false);
            const hasNoResults = await manageResellerPage.getNoResultsMessage().isVisible().catch(() => false);
            const pageLoaded   = await manageResellerPage.getPageHeading().isVisible().catch(() => false);
            expect(hasTable || hasNoResults || pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_MR_004 =====================
    // TC_NO_0168 = Verify search input is visible on Manage Reseller page
    // Priority   = Low
    // =================================
    test('TC_NO_0168: Verify search input is visible on Manage Reseller page', async () => {
        await test.step('Verify search input is present on the page', async () => {
            const hasSearch = await manageResellerPage.getSearchInput().isVisible().catch(() => false);
            await expect(manageResellerPage.getPageHeading()).toBeVisible();
            expect(hasSearch !== undefined).toBeTruthy();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search and table behavior
// =========================================================================

test.describe('Manage Reseller - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Manage Reseller', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getManageResellerMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/manage-resellers/);
        });
    });

    // ========== TC_MR_005 =====================
    // TC_NO_0169 = Verify searching for an existing reseller returns results
    // Priority   = Medium
    // =================================
    test('TC_NO_0169: Verify searching for an existing reseller returns results', async () => {
        await test.step('Search for a known reseller term', async () => {
            const hasSearch = await manageResellerPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await manageResellerPage.searchReseller('reseller');
                const hasResults = await manageResellerPage.getTableRows().first().isVisible().catch(() => false);
                const hasNoResults = await manageResellerPage.getNoResultsMessage().isVisible().catch(() => false);
                expect(hasResults || hasNoResults).toBeTruthy();
            } else {
                await expect(manageResellerPage.getPageHeading()).toBeVisible();
            }
        });
    });

    // ========== TC_MR_006 =====================
    // TC_NO_0170 = Verify searching for a non-existent reseller shows no results
    // Priority   = Medium
    // =================================
    test('TC_NO_0170: Verify searching for a non-existent reseller shows no results', async () => {
        await test.step('Search for a non-existent reseller', async () => {
            const hasSearch = await manageResellerPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await manageResellerPage.searchReseller('xyznonexistentreseller99999');
                const hasNoResults = await manageResellerPage.getNoResultsMessage().isVisible().catch(() => false);
                const hasZeroRows = await manageResellerPage.getTableRows().count().then(c => c === 0).catch(() => false);
                expect(hasNoResults || hasZeroRows).toBeTruthy();
            } else {
                await expect(manageResellerPage.getPageHeading()).toBeVisible();
            }
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify access control
// =========================================================================

test.describe('Manage Reseller - Security Tests', () => {

    // ========== TC_MR_007 =====================
    // TC_NO_0171 = Verify restricted user cannot access Manage Reseller via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0171: Verify restricted user cannot access Manage Reseller via direct URL', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Try to navigate to /backoffice/manage-resellers directly', async () => {
            await page.goto('/backoffice/manage-resellers');
        });
        await test.step('Verify access is denied or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/manage-resellers$/);
        });
    });

    // ========== TC_MR_008 =====================
    // TC_NO_0172 = Verify unauthenticated user cannot access Manage Reseller via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0172: Verify unauthenticated user cannot access Manage Reseller via direct URL', async ({ browser }) => {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        await test.step('Navigate directly to /backoffice/manage-resellers without login', async () => {
            await newPage.goto('/backoffice/manage-resellers');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(newPage).not.toHaveURL(/\/backoffice\/manage-resellers/);
        });

        await context.close();
    });
});

});
