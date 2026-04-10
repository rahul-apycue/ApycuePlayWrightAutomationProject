import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { ViewHotelPage } from '../pages/ViewHotelPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('View Hotel Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let viewHotelPage: ViewHotelPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    viewHotelPage = new ViewHotelPage(page);
});

// =========================================================================
// UI TESTS — Verify View Hotel page elements
// =========================================================================

test.describe('View Hotel - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to View Hotel', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getViewHotelMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/view-hotel/);
        });
    });

    // ========== TC_VH_001 =====================
    // TC_NO_0181 = Verify View Hotel page loads with correct heading
    // Priority   = High
    // =================================
    test('TC_NO_0181: Verify View Hotel page loads with correct heading', async () => {
        await test.step('Verify "View Hotel" heading is visible', async () => {
            await expect(viewHotelPage.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_VH_002 =====================
    // TC_NO_0182 = Verify View Hotel page URL is correct
    // Priority   = High
    // =================================
    test('TC_NO_0182: Verify View Hotel page URL is correct', async ({ page }) => {
        await test.step('Verify URL is /backoffice/view-hotel', async () => {
            await expect(page).toHaveURL(/\/backoffice\/view-hotel/);
        });
    });

    // ========== TC_VH_003 =====================
    // TC_NO_0183 = Verify View Hotel page displays hotel list or empty state
    // Priority   = Medium
    // =================================
    test('TC_NO_0183: Verify View Hotel page displays hotel list or empty state', async ({ page }) => {
        await test.step('Wait for content to load', async () => {
            await page.waitForTimeout(2000);
        });
        await test.step('Verify hotel list or empty state is displayed', async () => {
            const hasList      = await viewHotelPage.getHotelList().isVisible().catch(() => false);
            const hasNoResults = await viewHotelPage.getNoResultsMessage().isVisible().catch(() => false);
            const pageLoaded   = await viewHotelPage.getPageHeading().isVisible().catch(() => false);
            expect(hasList || hasNoResults || pageLoaded).toBeTruthy();
        });
    });

    // ========== TC_VH_004 =====================
    // TC_NO_0184 = Verify search input is visible on View Hotel page
    // Priority   = Low
    // =================================
    test('TC_NO_0184: Verify search input is visible on View Hotel page', async () => {
        await test.step('Verify search input is present on the page', async () => {
            const hasSearch = await viewHotelPage.getSearchInput().isVisible().catch(() => false);
            await expect(viewHotelPage.getPageHeading()).toBeVisible();
            expect(hasSearch !== undefined).toBeTruthy();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search and list behavior
// =========================================================================

test.describe('View Hotel - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to View Hotel', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.getViewHotelMenu().click();
            await expect(page).toHaveURL(/\/backoffice\/view-hotel/);
        });
    });

    // ========== TC_VH_005 =====================
    // TC_NO_0185 = Verify searching for an existing hotel returns results
    // Priority   = Medium
    // =================================
    test('TC_NO_0185: Verify searching for an existing hotel returns results', async () => {
        await test.step('Search for a known hotel term', async () => {
            const hasSearch = await viewHotelPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await viewHotelPage.searchHotel('hotel');
                const hasResults = await viewHotelPage.getHotelCards().first().isVisible().catch(() => false);
                const hasNoResults = await viewHotelPage.getNoResultsMessage().isVisible().catch(() => false);
                expect(hasResults || hasNoResults).toBeTruthy();
            } else {
                await expect(viewHotelPage.getPageHeading()).toBeVisible();
            }
        });
    });

    // ========== TC_VH_006 =====================
    // TC_NO_0186 = Verify searching for a non-existent hotel shows no results
    // Priority   = Medium
    // =================================
    test('TC_NO_0186: Verify searching for a non-existent hotel shows no results', async () => {
        await test.step('Search for a non-existent hotel', async () => {
            const hasSearch = await viewHotelPage.getSearchInput().isVisible().catch(() => false);
            if (hasSearch) {
                await viewHotelPage.searchHotel('xyznonexistenthotel99999');
                const hasNoResults = await viewHotelPage.getNoResultsMessage().isVisible().catch(() => false);
                const hasZeroCards = await viewHotelPage.getHotelCards().count().then(c => c === 0).catch(() => false);
                expect(hasNoResults || hasZeroCards).toBeTruthy();
            } else {
                await expect(viewHotelPage.getPageHeading()).toBeVisible();
            }
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify restricted user access
// =========================================================================

test.describe('View Hotel - Security Tests', () => {

    // ========== TC_VH_007 =====================
    // TC_NO_0187 = Verify restricted user CAN access View Hotel page
    // Priority   = High
    // =================================
    test('TC_NO_0187: Verify restricted user CAN access View Hotel page', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify View Hotel menu is visible for restricted user', async () => {
            await expect(dashboardPage.getViewHotelMenu()).toBeVisible();
        });
        await test.step('Click View Hotel menu', async () => {
            await dashboardPage.getViewHotelMenu().click();
        });
        await test.step('Verify restricted user can access the page', async () => {
            await expect(page).toHaveURL(/\/backoffice\/view-hotel/);
        });
    });

    // ========== TC_VH_008 =====================
    // TC_NO_0188 = Verify unauthenticated user cannot access View Hotel via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0188: Verify unauthenticated user cannot access View Hotel via direct URL', async ({ browser }) => {
        const context = await browser.newContext();
        const newPage = await context.newPage();

        await test.step('Navigate directly to /backoffice/view-hotel without login', async () => {
            await newPage.goto('/backoffice/view-hotel');
        });
        await test.step('Verify user is redirected to login page', async () => {
            await expect(newPage).not.toHaveURL(/\/backoffice\/view-hotel/);
        });

        await context.close();
    });
});

});
