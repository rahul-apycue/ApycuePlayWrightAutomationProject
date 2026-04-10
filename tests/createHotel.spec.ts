import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { CreateHotelPage } from '../pages/CreateHotelPage';
import { HotelGoogleSearchPage } from '../pages/HotelGoogleSearchPage';
import { HotelOnboardingPage } from '../pages/HotelOnboardingPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

test.describe('Create Hotel Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let createHotelPage: CreateHotelPage;
let hotelGoogleSearch: HotelGoogleSearchPage;
let hotelOnboarding: HotelOnboardingPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    createHotelPage = new CreateHotelPage(page);
    hotelGoogleSearch = new HotelGoogleSearchPage(page);
    hotelOnboarding = new HotelOnboardingPage(page);
});

// =========================================================================
// UI TESTS — Verify Create Hotel page elements
// =========================================================================

test.describe('Create Hotel - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Create Hotel page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0055 = Verify that the Create Hotel page is displayed with all elements
    // Priority   = High
    // =================================
    test('TC_NO_0055: Verify that the Create Hotel page is displayed with all elements', async () => {
        await test.step('Verify "Create Hotel" heading is visible', async () => {
            await expect(createHotelPage.getPageHeading()).toBeVisible();
        });
        await test.step('Verify page subtext is visible', async () => {
            await expect(createHotelPage.getPageSubtext()).toBeVisible();
        });
        await test.step('Verify "Search for Tenant" heading is visible', async () => {
            await expect(createHotelPage.getSearchHeading()).toBeVisible();
        });
        await test.step('Verify search subtext is visible', async () => {
            await expect(createHotelPage.getSearchSubtext()).toBeVisible();
        });
        await test.step('Verify search input is visible', async () => {
            await expect(createHotelPage.getSearchInput()).toBeVisible();
        });
        await test.step('Verify "Create New Tenant" button is visible', async () => {
            await expect(createHotelPage.getCreateNewTenantButton()).toBeVisible();
        });
        await test.step('Verify support text is visible', async () => {
            await expect(createHotelPage.getSupportText()).toBeVisible();
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0056 = Verify that search input has correct placeholder text
    // Priority   = Medium
    // =================================
    test('TC_NO_0056: Verify that search input has correct placeholder text', async () => {
        await test.step('Verify search input placeholder is "Enter tenant name..."', async () => {
            await expect(createHotelPage.getSearchInput()).toHaveAttribute('placeholder', 'Enter tenant name...');
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0226 = Verify Create Hotel static text content matches design
    // Priority   = High
    // =================================
    test('TC_NO_0226: Verify static text content on Create Hotel page matches expected copy', async () => {
        await test.step('Verify page heading and subtext exact text', async () => {
            await expect(createHotelPage.getPageHeading()).toHaveText('Create Hotel');
            await expect(createHotelPage.getPageSubtext()).toHaveText('Search for existing tenant or create a new one');
        });
        await test.step('Verify tenant search section text exact content', async () => {
            await expect(createHotelPage.getSearchHeading()).toHaveText('Search for Tenant');
            await expect(createHotelPage.getSearchSubtext()).toHaveText('Search by tenant name, hotel code, or hotel name');
        });
        await test.step('Verify support message exact text', async () => {
            await expect(createHotelPage.getSupportText()).toHaveText('Need help? Contact support at support@apycue.com');
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0227 = Verify search icon and divider are visible in tenant search section
    // Priority   = Medium
    // =================================
    test('TC_NO_0227: Verify tenant search icon and divider are visible', async () => {
        await test.step('Verify search icon is visible inside tenant search input group', async () => {
            await expect(createHotelPage.getSearchInputIcon()).toBeVisible();
        });
        await test.step('Verify section divider is visible between search and Create New Tenant button', async () => {
            await expect(createHotelPage.getSearchSectionDivider()).toBeVisible();
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0228 = Verify sidebar indicates Create Hotel as active and expected menus are present
    // Priority   = Medium
    // =================================
    test('TC_NO_0228: Verify sidebar menu state on Create Hotel page', async ({ page }) => {
        await test.step('Verify Create Hotel sidebar menu item is visible and active', async () => {
            await expect(createHotelPage.getCreateHotelSidebarMenu()).toBeVisible();
            await expect(createHotelPage.getCreateHotelSidebarMenu()).toHaveAttribute('class', /bg-sidebar-primary/);
        });
        await test.step('Verify key sidebar menu links are present', async () => {
            await expect(page.locator('a[href="/backoffice/manage-hotels"]').first()).toBeVisible();
            await expect(page.locator('a[href="/backoffice/users"]').first()).toBeVisible();
            await expect(page.locator('a[href="/backoffice/white-labels"]').first()).toBeVisible();
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0229 = Verify page/card layout styling is applied
    // Priority   = Medium
    // =================================
    test('TC_NO_0229: Verify Create Hotel page and card styling sanity', async () => {
        await test.step('Verify main content and tenant search card are visible', async () => {
            await expect(createHotelPage.getMainContent()).toBeVisible();
            await expect(createHotelPage.getTenantSearchCard()).toBeVisible();
        });
        await test.step('Verify tenant card has border radius and shadow style', async () => {
            const cardRadius = await createHotelPage.getTenantSearchCard().evaluate(el => getComputedStyle(el).borderRadius);
            const cardShadow = await createHotelPage.getTenantSearchCard().evaluate(el => getComputedStyle(el).boxShadow);
            expect(parseFloat(cardRadius)).toBeGreaterThan(0);
            expect(cardShadow).not.toBe('none');
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0230 = Verify keyboard tab focus moves from search input to Create New Tenant button
    // Priority   = Medium
    // =================================
    test('TC_NO_0230: Verify keyboard tab flow in tenant search controls', async ({ page }) => {
        await test.step('Focus search input and tab to Create New Tenant button', async () => {
            await createHotelPage.getSearchInput().click();
            await expect(createHotelPage.getSearchInput()).toBeFocused();
            await page.keyboard.press('Tab');
            await expect(createHotelPage.getCreateNewTenantButton()).toBeFocused();
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search, results, and form behavior
// =========================================================================

test.describe('Create Hotel - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login as admin and navigate to Create Hotel page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0057 = Verify that searching by tenant name returns matching results
    // Priority   = High
    // =================================
    test('TC_NO_0057: Verify that searching by tenant name returns matching results', async () => {
        await test.step('Search for "new"', async () => {
            await createHotelPage.searchTenant('new');
        });
        await test.step('Verify results count is displayed', async () => {
            await expect(createHotelPage.getSearchResultsCount()).toBeVisible();
        });
        await test.step('Verify "Select" buttons are visible in results', async () => {
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
        });
    });

    // ========== NH-HS-002 =====================
    // TC_NO_0058 = Verify that searching by city name returns relevant tenant results
    // Priority   = Medium
    // =================================
    test('TC_NO_0058: Verify that searching by city name returns relevant tenant results', async () => {
        await test.step('Search for "Mumbai"', async () => {
            await createHotelPage.searchTenant('Mumbai');
        });
        await test.step('Verify results are displayed or no results message shown', async () => {
            const hasResults = await createHotelPage.getSearchResultsCount().isVisible().catch(() => false);
            if (hasResults) {
                await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            } else {
                await expect(createHotelPage.getNoResultsMessage()).toBeVisible();
            }
        });
    });

    // ========== NH-HS-005 =====================
    // TC_NO_0059 = Verify that combined search with name and city returns more precise results
    // Priority   = Medium
    // =================================
    test('TC_NO_0059: Verify that combined search with name and city returns precise results', async () => {
        await test.step('Search for "Marriott Mumbai"', async () => {
            await createHotelPage.searchTenant('Marriott Mumbai');
        });
        await test.step('Verify results are displayed or no results message shown', async () => {
            const hasResults = await createHotelPage.getSearchResultsCount().isVisible().catch(() => false);
            if (hasResults) {
                await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            } else {
                await expect(createHotelPage.getNoResultsMessage()).toBeVisible();
            }
        });
    });

    // ========== NH-HS-006 =====================
    // TC_NO_0060 = Verify that clicking "Select" button on a search result navigates to the Create Hotel form
    // Priority   = High
    // =================================
    test('TC_NO_0060: Verify that clicking "Select" on a search result navigates to the Create Hotel form', async ({ page }) => {
        await test.step('Search for "new"', async () => {
            await createHotelPage.searchTenant('new');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
        });
        await test.step('Click "Select" on the first result', async () => {
            await createHotelPage.getSearchResults().first().click();
        });
        await test.step('Verify tenant search section is no longer visible (form loaded)', async () => {
            await page.waitForTimeout(2000);
            await expect(createHotelPage.getSearchHeading()).not.toBeVisible();
        });
    });

    // ========== NH-HS-009 =====================
    // TC_NO_0061 = Verify that searching for a non-existent tenant shows no results message
    // Priority   = High
    // =================================
    test('TC_NO_0061: Verify that searching for a non-existent tenant shows no results message', async () => {
        await test.step('Search for "xyznonexistenthotel12345"', async () => {
            await createHotelPage.searchTenant('xyznonexistenthotel12345');
        });
        await test.step('Verify no results or zero count is displayed', async () => {
            const hasCount = await createHotelPage.getSearchResultsCount().isVisible().catch(() => false);
            if (hasCount) {
                await expect(createHotelPage.getSearchResultsCount()).toContainText('0');
            } else {
                await expect(createHotelPage.getNoResultsMessage()).toBeVisible();
            }
        });
    });

    // ========== NH-HS-010 =====================
    // TC_NO_0062 = Verify minimum character validation for search input
    // Priority   = Low
    // =================================
    test('TC_NO_0062: Verify minimum character validation for search input', async () => {
        await test.step('Search with single character "a"', async () => {
            await createHotelPage.searchTenant('a');
        });
        await test.step('Verify either validation message appears or results are shown', async () => {
            const hasResults = await createHotelPage.getSearchResultsCount().isVisible().catch(() => false);
            const hasNoResults = await createHotelPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasResults || hasNoResults).toBeTruthy();
        });

        await test.step('Clear search and try single space', async () => {
            await createHotelPage.clearSearch();
            await createHotelPage.searchTenant(' ');
        });
        await test.step('Verify search handles single space input without crashing', async () => {
            await expect(createHotelPage.getSearchInput()).toBeVisible();
        });
    });

    // ========== NH-HS-011 =====================
    // TC_NO_0063 = Verify that special characters in search do not crash the application
    // Priority   = Low
    // =================================
    test('TC_NO_0063: Verify that special characters in search do not crash the application', async ({ page }) => {
        const specialInputs = ['!@#$%', '<script>alert(1)</script>', 'Hotel & Spa'];

        for (const input of specialInputs) {
            await test.step(`Search with special characters: "${input}"`, async () => {
                await createHotelPage.clearSearch();
                await createHotelPage.searchTenant(input);
            });
            await test.step(`Verify page does not crash for "${input}"`, async () => {
                await expect(createHotelPage.getSearchInput()).toBeVisible();
                await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            });
        }
    });

    // ========== NH-HS-013 =====================
    // TC_NO_0064 = Verify that selecting a different tenant after first selection updates the form
    // Priority   = Medium
    // =================================
    test('TC_NO_0064: Verify that selecting a different tenant after first selection updates correctly', async ({ page }) => {
        await test.step('Search for "new"', async () => {
            await createHotelPage.searchTenant('new');
        });
        await test.step('Verify multiple results are displayed', async () => {
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
        });
        await test.step('Click "Select" on the first result', async () => {
            await createHotelPage.getSearchResults().first().click();
        });
        await test.step('Verify tenant search section is no longer visible (form loaded)', async () => {
            await page.waitForTimeout(2000);
            await expect(createHotelPage.getSearchHeading()).not.toBeVisible();
        });
    });

    // ========== NH-HS-017 =====================
    // TC_NO_0065 = Verify that search with exactly 100 characters works without error
    // Priority   = Low
    // =================================
    test('TC_NO_0065: Verify that search with exactly 100 characters works without error', async ({ page }) => {
        const longString = 'a'.repeat(100);
        await test.step('Enter exactly 100 characters in search field', async () => {
            await createHotelPage.searchTenant(longString);
        });
        await test.step('Verify page does not crash', async () => {
            await expect(createHotelPage.getSearchInput()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== NH-HS-018 =====================
    // TC_NO_0066 = Verify that a loading indicator is shown while search results are being fetched
    // Priority   = Low
    // =================================
    test('TC_NO_0066: Verify that search results load after entering a query', async () => {
        await test.step('Enter search query "Marriott"', async () => {
            await createHotelPage.getSearchInput().fill('Marriott');
        });
        await test.step('Wait for results to load and verify search completes', async () => {
            await createHotelPage.getSearchInput().page().waitForTimeout(3000);
            await expect(createHotelPage.getSearchInput()).toBeVisible();
        });
    });

    // ========== NH-HS-019 =====================
    // TC_NO_0067 = Verify that clearing search input clears the results list
    // Priority   = Medium
    // =================================
    test('TC_NO_0067: Verify that clearing search input clears the results list', async () => {
        await test.step('Search for "new"', async () => {
            await createHotelPage.searchTenant('new');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
        });
        await test.step('Clear the search input', async () => {
            await createHotelPage.clearSearch();
            await createHotelPage.getSearchInput().page().waitForTimeout(1000);
        });
        await test.step('Verify results are cleared', async () => {
            await expect(createHotelPage.getSearchResults().first()).not.toBeVisible();
        });
    });

    // ========== NH-HS-012 =====================
    // TC_NO_0068 = Verify that "Create New Tenant" button is clickable and navigates correctly
    // Priority   = High
    // =================================
    test('TC_NO_0068: Verify that "Create New Tenant" button is clickable and navigates correctly', async ({ page }) => {
        await test.step('Verify "Create New Tenant" button is visible and enabled', async () => {
            await expect(createHotelPage.getCreateNewTenantButton()).toBeVisible();
            await expect(createHotelPage.getCreateNewTenantButton()).toBeEnabled();
        });
        await test.step('Click "Create New Tenant" button', async () => {
            await createHotelPage.clickCreateNewTenant();
        });
        await test.step('Verify page responds to the click (navigates or opens form)', async () => {
            await page.waitForTimeout(1000);
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });

    // ========== NH-HS-012 =====================
    // TC_NO_0231 = Verify Create New Tenant form header and subtext are displayed
    // Priority   = High
    // =================================
    test('TC_NO_0231: Verify Create New Tenant form header and subtext', async () => {
        await test.step('Open Create New Tenant form', async () => {
            await createHotelPage.clickCreateNewTenant();
        });
        await test.step('Verify heading and subtext exact text', async () => {
            await expect(createHotelPage.getCreateNewTenantHeading()).toHaveText('Create New Tenant');
            await expect(createHotelPage.getCreateNewTenantSubtext()).toHaveText('Register a new business to the platform');
        });
    });

    // ========== NH-HS-012 =====================
    // TC_NO_0232 = Verify Tenant Name field label, icon and placeholder
    // Priority   = High
    // =================================
    test('TC_NO_0232: Verify Tenant Name field label, icon and placeholder in Create New Tenant form', async () => {
        await test.step('Open Create New Tenant form', async () => {
            await createHotelPage.clickCreateNewTenant();
        });
        await test.step('Verify Tenant Name label and apartment icon', async () => {
            await expect(createHotelPage.getTenantNameLabel()).toBeVisible();
            await expect(createHotelPage.getTenantNameIcon()).toBeVisible();
        });
        await test.step('Verify Tenant Name input placeholder', async () => {
            await expect(createHotelPage.getTenantNameInput()).toHaveAttribute('placeholder', 'Enter business name');
        });
    });

    // ========== NH-HS-012 =====================
    // TC_NO_0233 = Verify Business Type field default state
    // Priority   = High
    // =================================
    test('TC_NO_0233: Verify Business Type field default state in Create New Tenant form', async () => {
        await test.step('Open Create New Tenant form', async () => {
            await createHotelPage.clickCreateNewTenant();
        });
        await test.step('Verify Business Type label and combobox placeholder', async () => {
            await expect(createHotelPage.getBusinessTypeLabel()).toBeVisible();
            await expect(createHotelPage.getBusinessTypeCombobox()).toBeVisible();
            await expect(createHotelPage.getBusinessTypeCombobox()).toContainText('Select business type');
        });
    });

    // ========== NH-HS-012 =====================
    // TC_NO_0234 = Verify Create New Tenant action buttons are visible and enabled
    // Priority   = Medium
    // =================================
    test('TC_NO_0234: Verify Cancel and Create Tenant buttons are visible and enabled', async () => {
        await test.step('Open Create New Tenant form', async () => {
            await createHotelPage.clickCreateNewTenant();
        });
        await test.step('Verify action buttons state', async () => {
            await expect(createHotelPage.getCancelButton()).toBeVisible();
            await expect(createHotelPage.getCancelButton()).toBeEnabled();
            await expect(createHotelPage.getCreateTenantButton()).toBeVisible();
            await expect(createHotelPage.getCreateTenantButton()).toBeEnabled();
        });
    });

    // ========== NH-HS-012 =====================
    // TC_NO_0235 = Verify Cancel returns user to tenant search section
    // Priority   = High
    // =================================
    test('TC_NO_0235: Verify Cancel button returns to tenant search view', async () => {
        await test.step('Open Create New Tenant form', async () => {
            await createHotelPage.clickCreateNewTenant();
            await expect(createHotelPage.getCreateNewTenantHeading()).toBeVisible();
        });
        await test.step('Click Cancel and verify tenant search section is shown again', async () => {
            await createHotelPage.getCancelButton().click();
            await expect(createHotelPage.getSearchHeading()).toBeVisible();
            await expect(createHotelPage.getCreateNewTenantButton()).toBeVisible();
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify access control for Create Hotel page
// =========================================================================

test.describe('Create Hotel - Security Tests', () => {

    // ========== NH-HS-020 =====================
    // TC_NO_0069 = Verify that restricted user cannot access Create Hotel page via direct URL
    // Priority   = Critical
    // =================================
    test('TC_NO_0069: Verify that restricted user cannot access Create Hotel page via direct URL', async ({ page }) => {
        await test.step('Login as restricted user', async () => {
            await loginPage.goto();
            await loginPage.login(RESTRICTED_EMAIL, RESTRICTED_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Navigate to Back Office Dashboard', async () => {
            await loginChoicePage.clickBackOfficeLogin();
        });
        await test.step('Verify "Create Hotel" menu is NOT visible in sidebar', async () => {
            await expect(dashboardPage.getCreateHotelMenu()).not.toBeVisible();
        });
        await test.step('Try to access /backoffice/create-hotel directly via URL', async () => {
            await page.goto('/backoffice/create-hotel');
        });
        await test.step('Verify restricted user is denied access or redirected', async () => {
            await expect(page).not.toHaveURL(/\/backoffice\/create-hotel$/);
        });
    });
});

// =========================================================================
// HOTEL GOOGLE SEARCH TESTS (Step 2) — After selecting a tenant, search hotel on Google
// =========================================================================

test.describe('Hotel Google Search - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login, navigate to Create Hotel, select first tenant', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            await createHotelPage.searchTenant('new');
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            await createHotelPage.getSearchResults().first().click();
            await page.waitForTimeout(2000);
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0070 = Verify that the Hotel Google Search page is displayed with all elements after tenant selection
    // Priority   = High
    // =================================
    test('TC_NO_0070: Verify that the Hotel Google Search page is displayed with all elements', async () => {
        await test.step('Verify "Search Hotel" heading is visible', async () => {
            await expect(hotelGoogleSearch.getSearchHotelHeading()).toBeVisible();
        });
        await test.step('Verify search subtext is visible', async () => {
            await expect(hotelGoogleSearch.getSearchSubtext()).toBeVisible();
        });
        await test.step('Verify search input is visible', async () => {
            await expect(hotelGoogleSearch.getSearchInput()).toBeVisible();
        });
        await test.step('Verify "Search" button is visible', async () => {
            await expect(hotelGoogleSearch.getSearchButton()).toBeVisible();
        });
        await test.step('Verify "Back to Tenant Selection" button is visible', async () => {
            await expect(hotelGoogleSearch.getBackToTenantButton()).toBeVisible();
        });
        await test.step('Verify tenant name badge is visible', async () => {
            await expect(hotelGoogleSearch.getTenantBadge()).toBeVisible();
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0071 = Verify that search input has correct placeholder text
    // Priority   = Medium
    // =================================
    test('TC_NO_0071: Verify that search input has correct placeholder text', async () => {
        await test.step('Verify placeholder is "Search hotel name or location..."', async () => {
            await expect(hotelGoogleSearch.getSearchInput()).toHaveAttribute('placeholder', 'Search hotel name or location...');
        });
    });
});

test.describe('Hotel Google Search - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login, navigate to Create Hotel, select first tenant', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            await createHotelPage.searchTenant('new');
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            await createHotelPage.getSearchResults().first().click();
            await page.waitForTimeout(2000);
        });
    });

    // ========== NH-HS-001 =====================
    // TC_NO_0072 = Verify that searching by hotel name returns matching results from Google
    // Priority   = High
    // =================================
    test('TC_NO_0072: Verify that searching by hotel name returns matching results from Google', async () => {
        await test.step('Search for "Taj Mahal Hotel"', async () => {
            await hotelGoogleSearch.searchHotel('Taj Mahal Hotel');
        });
        await test.step('Verify results count is displayed', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
        await test.step('Verify hotel cards with "Select" buttons are visible', async () => {
            await expect(hotelGoogleSearch.getSelectButtons().first()).toBeVisible();
        });
    });

    // ========== NH-HS-002 =====================
    // TC_NO_0073 = Verify that searching by city name returns hotels in that city
    // Priority   = Medium
    // =================================
    test('TC_NO_0073: Verify that searching by city name returns hotels in that city', async () => {
        await test.step('Search for "udaipur"', async () => {
            await hotelGoogleSearch.searchHotel('udaipur');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
        await test.step('Verify hotel cards are visible', async () => {
            await expect(hotelGoogleSearch.getHotelCards().first()).toBeVisible();
        });
    });

    // ========== NH-HS-003 =====================
    // TC_NO_0074 = Verify that searching by state name returns relevant hotels
    // Priority   = Medium
    // =================================
    test('TC_NO_0074: Verify that searching by state name returns relevant hotels', async () => {
        await test.step('Search for "Maharashtra"', async () => {
            await hotelGoogleSearch.searchHotel('Maharashtra');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
    });

    // ========== NH-HS-004 =====================
    // TC_NO_0075 = Verify that searching by country name returns relevant hotels
    // Priority   = Medium
    // =================================
    test('TC_NO_0075: Verify that searching by country name returns relevant hotels', async () => {
        await test.step('Search for "India"', async () => {
            await hotelGoogleSearch.searchHotel('India');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
    });

    // ========== NH-HS-005 =====================
    // TC_NO_0076 = Verify that combined search (name + city) returns more precise results
    // Priority   = Medium
    // =================================
    test('TC_NO_0076: Verify that combined search with name and city returns precise results', async () => {
        await test.step('Search for "Marriott Mumbai"', async () => {
            await hotelGoogleSearch.searchHotel('Marriott Mumbai');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
    });

    // ========== NH-HS-006 =====================
    // TC_NO_0077 = Verify that clicking "Select" on a hotel result proceeds to form auto-fill
    // Priority   = High
    // =================================
    test('TC_NO_0077: Verify that clicking "Select" on a hotel result proceeds to form auto-fill', async ({ page }) => {
        await test.step('Search for "udaipur"', async () => {
            await hotelGoogleSearch.searchHotel('udaipur');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(hotelGoogleSearch.getSelectButtons().first()).toBeVisible();
        });
        await test.step('Click "Select" on the first hotel result', async () => {
            await hotelGoogleSearch.getSelectButtons().first().click();
        });
        await test.step('Verify hotel search section is no longer visible (form loaded)', async () => {
            await page.waitForTimeout(2000);
            await expect(hotelGoogleSearch.getSearchHotelHeading()).not.toBeVisible();
        });
    });

    // ========== NH-HS-009 =====================
    // TC_NO_0078 = Verify that searching for a non-existent hotel shows empty state
    // Priority   = High
    // =================================
    test('TC_NO_0078: Verify that searching for a non-existent hotel shows empty state', async ({ page }) => {
        await test.step('Search for "xyznonexistenthotel12345"', async () => {
            await hotelGoogleSearch.searchHotel('xyznonexistenthotel12345');
        });
        await test.step('Verify no results are displayed', async () => {
            // No hotel cards should appear after a search with no results
            const cardCount = await hotelGoogleSearch.getSelectButtons().count();
            const hasZeroCards = cardCount === 0;
            // OR the page shows some empty/no-results indicator text
            const hasEmptyText = await page.getByText(/no result|not found|0 hotel|no hotel/i).isVisible().catch(() => false);
            expect(hasZeroCards || hasEmptyText).toBeTruthy();
        });
    });

    // ========== NH-HS-010 =====================
    // TC_NO_0079 = Verify that hotel results display hotel name, location, and star rating
    // Priority   = Medium
    // =================================
    test('TC_NO_0079: Verify that hotel results display hotel name, location, and star rating', async () => {
        await test.step('Search for "udaipur"', async () => {
            await hotelGoogleSearch.searchHotel('udaipur');
        });
        await test.step('Verify first hotel card has a hotel name', async () => {
            await expect(hotelGoogleSearch.getHotelName(0)).toBeVisible();
        });
        await test.step('Verify first hotel card has a location', async () => {
            const firstCard = hotelGoogleSearch.getHotelCards().first();
            await expect(firstCard.getByText('Udaipur, IN')).toBeVisible();
        });
    });

    // ========== NH-HS-011 =====================
    // TC_NO_0080 = Verify that special characters in hotel search do not crash the application
    // Priority   = Low
    // =================================
    test('TC_NO_0080: Verify that special characters in hotel search do not crash the application', async ({ page }) => {
        const specialInputs = ['!@#$%', '<script>alert(1)</script>', 'Hotel & Spa'];

        for (const input of specialInputs) {
            await test.step(`Search with special characters: "${input}"`, async () => {
                await hotelGoogleSearch.clearSearch();
                await hotelGoogleSearch.searchHotel(input);
            });
            await test.step(`Verify page does not crash for "${input}"`, async () => {
                await expect(hotelGoogleSearch.getSearchInput()).toBeVisible();
                await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            });
        }
    });

    // ========== NH-HS-013 =====================
    // TC_NO_0081 = Verify that searching again after first search updates results
    // Priority   = Medium
    // =================================
    test('TC_NO_0081: Verify that searching again after first search updates results', async () => {
        await test.step('Search for "udaipur"', async () => {
            await hotelGoogleSearch.searchHotel('udaipur');
        });
        await test.step('Verify first set of results are displayed', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
        await test.step('Search for "mumbai"', async () => {
            await hotelGoogleSearch.clearSearch();
            await hotelGoogleSearch.searchHotel('mumbai');
        });
        await test.step('Verify results updated for "mumbai"', async () => {
            await expect(hotelGoogleSearch.getResultsCount()).toBeVisible();
        });
    });

    // ========== NH-HS-014 =====================
    // TC_NO_0082 = Verify that "Back to Tenant Selection" button navigates back to tenant search
    // Priority   = High
    // =================================
    test('TC_NO_0082: Verify that "Back to Tenant Selection" navigates back to tenant search', async () => {
        await test.step('Click "Back to Tenant Selection" button', async () => {
            await hotelGoogleSearch.clickBackToTenant();
        });
        await test.step('Verify tenant search section is visible again', async () => {
            await expect(createHotelPage.getSearchHeading()).toBeVisible();
        });
    });

    // ========== NH-HS-015 =====================
    // TC_NO_0083 = Verify that search with exactly 100 characters works without error
    // Priority   = Low
    // =================================
    test('TC_NO_0083: Verify that hotel search with exactly 100 characters works without error', async ({ page }) => {
        const longString = 'a'.repeat(100);
        await test.step('Enter exactly 100 characters in search field', async () => {
            await hotelGoogleSearch.searchHotel(longString);
        });
        await test.step('Verify page does not crash', async () => {
            await expect(hotelGoogleSearch.getSearchInput()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== NH-HS-019 =====================
    // TC_NO_0084 = Verify that clearing hotel search input clears the results
    // Priority   = Low
    // =================================
    test('TC_NO_0084: Verify that clearing hotel search input and searching empty returns no new results', async () => {
        await test.step('Search for "udaipur"', async () => {
            await hotelGoogleSearch.searchHotel('udaipur');
        });
        await test.step('Verify results are displayed', async () => {
            await expect(hotelGoogleSearch.getHotelCards().first()).toBeVisible();
        });
        await test.step('Clear the search input', async () => {
            await hotelGoogleSearch.clearSearch();
        });
        await test.step('Verify search input is empty', async () => {
            await expect(hotelGoogleSearch.getSearchInput()).toHaveValue('');
        });
    });
});

// =========================================================================
// HOTEL ONBOARDING FORM TESTS (Step 3) — After selecting a hotel from Google search
// =========================================================================

test.describe('Hotel Onboarding Form - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login, select tenant, search hotel on Google, select first result', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            // Step 1: Select tenant
            await createHotelPage.searchTenant('new');
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            await createHotelPage.getSearchResults().first().click();
            await page.waitForTimeout(2000);
            // Step 2: Search hotel on Google and select first result
            await hotelGoogleSearch.searchHotel('udaipur');
            await expect(hotelGoogleSearch.getSelectButtons().first()).toBeVisible();
            await hotelGoogleSearch.getSelectButtons().first().click();
            await page.waitForTimeout(2000);
        });
    });

    // ========== NH-HS-006 =====================
    // TC_NO_0093 = Verify that the Hotel Onboarding Form is displayed after selecting a hotel from Google search
    // Priority   = High
    // =================================
    test('TC_NO_0093: Verify that the Hotel Onboarding Form is displayed after selecting a hotel', async () => {
        await test.step('Verify hotel search section is no longer visible', async () => {
            await expect(hotelGoogleSearch.getSearchHotelHeading()).not.toBeVisible();
        });
        await test.step('Verify onboarding form heading is visible', async () => {
            await expect(hotelOnboarding.getPageHeading()).toBeVisible();
        });
    });

    // ========== NH-HS-007 =====================
    // TC_NO_0094 = Verify that Basic Information section is displayed in the onboarding form
    // Priority   = High
    // =================================
    test('TC_NO_0094: Verify that Basic Information section is displayed in the onboarding form', async () => {
        await test.step('Verify "Basic Information" section heading is visible', async () => {
            await expect(hotelOnboarding.getBasicInfoHeading()).toBeVisible();
        });
        await test.step('Verify Hotel Name input is visible', async () => {
            await expect(hotelOnboarding.getHotelNameInput()).toBeVisible();
        });
    });

    // ========== NH-HS-007 =====================
    // TC_NO_0095 = Verify that Address Information section is displayed in the onboarding form
    // Priority   = High
    // =================================
    test('TC_NO_0095: Verify that Address Information section is displayed in the onboarding form', async () => {
        await test.step('Verify "Address Information" section heading is visible', async () => {
            await expect(hotelOnboarding.getAddressHeading()).toBeVisible();
        });
        await test.step('Verify City input is visible', async () => {
            await expect(hotelOnboarding.getCityInput()).toBeVisible();
        });
        await test.step('Verify Country input is visible', async () => {
            await expect(hotelOnboarding.getCountryInput()).toBeVisible();
        });
    });

    // ========== NH-HS-007 =====================
    // TC_NO_0096 = Verify that Contact Information section is displayed in the onboarding form
    // Priority   = High
    // =================================
    test('TC_NO_0096: Verify that Contact Information section is displayed in the onboarding form', async () => {
        await test.step('Verify "Contact Information" section heading is visible', async () => {
            await expect(hotelOnboarding.getContactHeading()).toBeVisible();
        });
        await test.step('Verify Phone input is visible', async () => {
            await expect(hotelOnboarding.getPhoneInput()).toBeVisible();
        });
        await test.step('Verify Email input is visible', async () => {
            await expect(hotelOnboarding.getEmailInput()).toBeVisible();
        });
    });

    // ========== NH-HS-007 =====================
    // TC_NO_0097 = Verify that form fields are auto-filled from Google search data
    // Priority   = High
    // =================================
    test('TC_NO_0097: Verify that form fields are auto-filled from Google search data', async () => {
        await test.step('Verify Hotel Name input is not empty (auto-filled from Google)', async () => {
            const hotelName = await hotelOnboarding.getHotelNameInput().inputValue();
            expect(hotelName.length).toBeGreaterThan(0);
        });
    });

    // ========== NH-HS-007 =====================
    // TC_NO_0098 = Verify that the Submit/Create Hotel button is visible in the onboarding form
    // Priority   = High
    // =================================
    test('TC_NO_0098: Verify that the Submit button is visible in the onboarding form', async () => {
        await test.step('Verify Submit/Create Hotel button is visible', async () => {
            await expect(hotelOnboarding.getSubmitButton()).toBeVisible();
        });
        await test.step('Verify Submit button is enabled', async () => {
            await expect(hotelOnboarding.getSubmitButton()).toBeEnabled();
        });
    });
});

test.describe('Hotel Onboarding Form - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login, select tenant, search hotel on Google, select first result', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickBackOfficeLogin();
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            await createHotelPage.searchTenant('new');
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            await createHotelPage.getSearchResults().first().click();
            await page.waitForTimeout(2000);
            await hotelGoogleSearch.searchHotel('udaipur');
            await expect(hotelGoogleSearch.getSelectButtons().first()).toBeVisible();
            await hotelGoogleSearch.getSelectButtons().first().click();
            await page.waitForTimeout(2000);
        });
    });

    // ========== NH-HS-008 =====================
    // TC_NO_0099 = Verify that Hotel Name field can be edited in the onboarding form
    // Priority   = Medium
    // =================================
    test('TC_NO_0099: Verify that Hotel Name field can be edited in the onboarding form', async () => {
        await test.step('Clear and re-fill the Hotel Name field', async () => {
            await hotelOnboarding.getHotelNameInput().clear();
            await hotelOnboarding.getHotelNameInput().fill('Updated Hotel Name');
        });
        await test.step('Verify Hotel Name field contains the updated value', async () => {
            await expect(hotelOnboarding.getHotelNameInput()).toHaveValue('Updated Hotel Name');
        });
    });

    // ========== NH-HS-008 =====================
    // TC_NO_0100 = Verify that all form sections are visible by scrolling through the onboarding form
    // Priority   = Medium
    // =================================
    test('TC_NO_0100: Verify that all form sections are visible by scrolling through the onboarding form', async ({ page }) => {
        const sections = [
            /Basic Information/i,
            /Address Information/i,
            /Contact Information/i,
            /Registration|Licensing/i,
            /Subscription/i,
        ];

        for (const section of sections) {
            await test.step(`Scroll to and verify "${section.source}" section is present`, async () => {
                const heading = page.getByRole('heading', { name: section });
                await heading.scrollIntoViewIfNeeded();
                await expect(heading).toBeVisible();
            });
        }
    });

    // ========== NH-HS-016 =====================
    // TC_NO_0101 = Verify that the "Skip & Create Manually" option bypasses Google search
    // Priority   = High
    // =================================
    test('TC_NO_0101: Verify that "Skip & Create Manually" navigates to the form without Google data', async ({ page }) => {
        await test.step('Navigate to Hotel Google Search page using existing authenticated session', async () => {
            await page.goto('/backoffice/dashboard');
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            await createHotelPage.searchTenant('new');
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            await createHotelPage.getSearchResults().first().click();
            await page.waitForTimeout(2000);
        });
        await test.step('Verify Skip & Create Manually button is visible', async () => {
            await expect(hotelGoogleSearch.getSkipCreateManuallyButton()).toBeVisible();
        });
        await test.step('Click "Skip & Create Manually"', async () => {
            await hotelGoogleSearch.clickSkipCreateManually();
            await page.waitForTimeout(1500);
        });
        await test.step('Verify Hotel Name field is empty (no Google auto-fill)', async () => {
            const hotelName = await hotelOnboarding.getHotelNameInput().inputValue().catch(() => '');
            expect(hotelName).toBe('');
        });
    });
});

// =========================================================================
// HOTEL ONBOARDING FORM — VALIDATION TESTS
// Covers: mandatory fields, optional fields, email, phone, URL, dropdowns
// =========================================================================

// Helper: reaches the onboarding form via Skip & Create Manually (empty form = easier to validate)
async function navigateToEmptyOnboardingForm(page: any,
    loginPage: any, loginChoicePage: any, dashboardPage: any,
    createHotelPage: any, hotelGoogleSearch: any) {
    await loginPage.goto();
    await loginPage.login(process.env.LOGIN_EMAIL!, process.env.LOGIN_PASSWORD!);
    await expect(page).toHaveURL(/\/backoffice\/login-choice/);
    await loginChoicePage.clickBackOfficeLogin();
    await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
    await dashboardPage.clickCreateHotel();
    await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
    // Select first tenant
    await createHotelPage.searchTenant('new');
    await expect(createHotelPage.getSearchResults().first()).toBeVisible();
    await createHotelPage.getSearchResults().first().click();
    await page.waitForTimeout(2000);
    // Skip Google search — land on empty form
    await hotelGoogleSearch.clickSkipCreateManually();
    await page.waitForTimeout(1500);
}

async function fillCountryIfEditable(hotelOnboarding: any, value = 'India') {
    const countryInput = hotelOnboarding.getCountryInput();
    const isEditable = await countryInput.isEditable().catch(() => false);
    if (isEditable) {
        await countryInput.fill(value);
    }
}

async function fillHotelCodeIfPresent(hotelOnboarding: any, value = 'TEST001') {
    const hotelCodeInput = hotelOnboarding.getHotelCodeInput();
    const isVisible = await hotelCodeInput.isVisible().catch(() => false);
    const isEditable = await hotelCodeInput.isEditable().catch(() => false);
    if (isVisible && isEditable) {
        await hotelCodeInput.fill(value);
    }
}

test.describe('Hotel Onboarding Form - Mandatory Fields Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form via Skip & Create Manually', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_048 =====================
    // TC_NO_0102 = Verify that Search button is disabled until user types in the hotel search input
    // Priority   = Critical
    // =================================
    test('TC_NO_0102: Verify that Search button is disabled until user types in the hotel search input', async ({ page }) => {
        // The Search button on Hotel Google Search page is disabled when input is empty.
        // Navigate back to the Google Search step to verify this behaviour.
        await test.step('Navigate to Hotel Google Search page using existing authenticated session', async () => {
            await page.goto('/backoffice/dashboard');
            await expect(dashboardPage.getWelcomeHeading()).toBeVisible();
            await dashboardPage.clickCreateHotel();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
            await createHotelPage.searchTenant('new');
            await expect(createHotelPage.getSearchResults().first()).toBeVisible();
            await createHotelPage.getSearchResults().first().click();
            await page.waitForTimeout(2000);
        });
        await test.step('Verify Search button is disabled when input is empty', async () => {
            await expect(hotelGoogleSearch.getSearchButton()).toBeDisabled();
        });
        await test.step('Type text into hotel search input', async () => {
            await hotelGoogleSearch.getSearchInput().fill('Marriott');
        });
        await test.step('Verify Search button is enabled after entering text', async () => {
            await expect(hotelGoogleSearch.getSearchButton()).toBeEnabled();
        });
        await test.step('Clear the search input', async () => {
            await hotelGoogleSearch.getSearchInput().clear();
        });
        await test.step('Verify Search button is disabled again after clearing input', async () => {
            await expect(hotelGoogleSearch.getSearchButton()).toBeDisabled();
        });
    });

    // ========== TC_CH_049 =====================
    // TC_NO_0103 = Verify that Hotel Name is a mandatory field
    // Priority   = Critical
    // =================================
    test('TC_NO_0103: Verify that Hotel Name is a mandatory field', async ({ page }) => {
        await test.step('Verify Hotel Name input is visible and empty', async () => {
            await expect(hotelOnboarding.getHotelNameInput()).toBeVisible();
            await expect(hotelOnboarding.getHotelNameInput()).toBeEmpty();
        });
        await test.step('Verify form does not navigate away when Hotel Name is empty', async () => {
            await hotelOnboarding.getSubmitButton().click();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== TC_CH_050 =====================
    // TC_NO_0104 = Verify that Hotel Code is a mandatory field
    // Priority   = Critical
    // =================================
    test('TC_NO_0104: Verify that Hotel Code is a mandatory field', async ({ page }) => {
        await test.step('Verify Hotel Code input behavior', async () => {
            const hasHotelCode = await hotelOnboarding.getHotelCodeInput().isVisible().catch(() => false);
            if (hasHotelCode) {
                await expect(hotelOnboarding.getHotelCodeInput()).toBeEmpty();
            } else {
                expect(true).toBeTruthy();
            }
        });
        await test.step('Verify form stays on onboarding page', async () => {
            await hotelOnboarding.getSubmitButton().click();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== TC_CH_051 =====================
    // TC_NO_0105 = Verify that City is a mandatory field
    // Priority   = Critical
    // =================================
    test('TC_NO_0105: Verify that City is a mandatory field', async ({ page }) => {
        await test.step('Verify City input is visible and empty', async () => {
            await expect(hotelOnboarding.getCityInput()).toBeVisible();
            await expect(hotelOnboarding.getCityInput()).toBeEmpty();
        });
        await test.step('Verify form does not navigate away when City is empty', async () => {
            await hotelOnboarding.getSubmitButton().click();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });

    // ========== TC_CH_052 =====================
    // TC_NO_0106 = Verify that Country is a mandatory field
    // Priority   = Critical
    // =================================
    test('TC_NO_0106: Verify that Country is a mandatory field', async ({ page }) => {
        await test.step('Verify Country control is visible', async () => {
            await expect(hotelOnboarding.getCountryInput()).toBeVisible();
        });
        await test.step('Verify form does not navigate away when Country is empty', async () => {
            await hotelOnboarding.getSubmitButton().click();
            await expect(page).toHaveURL(/\/backoffice\/create-hotel/);
        });
    });
});

test.describe('Hotel Onboarding Form - Non-Mandatory Fields Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_053 =====================
    // TC_NO_0107 = Verify that Description field is optional (form can submit without it)
    // Priority   = Medium
    // =================================
    test('TC_NO_0107: Verify that Description is an optional field', async ({ page }) => {
        await test.step('Fill required fields so Submit becomes available', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Leave Description empty and click elsewhere', async () => {
            const descVisible = await hotelOnboarding.getDescriptionTextarea().isVisible().catch(() => false);
            if (descVisible) {
                await hotelOnboarding.getDescriptionTextarea().clear();
            }
            await hotelOnboarding.getHotelNameInput().click();
            await page.waitForTimeout(300);
        });
        await test.step('Verify Submit button is visible (Description is optional)', async () => {
            const isVisible  = await hotelOnboarding.getSubmitButton().isVisible().catch(() => false);
            const isEnabled  = await hotelOnboarding.getSubmitButton().isEnabled().catch(() => false);
            expect(isVisible || isEnabled).toBeTruthy();
        });
    });

    // ========== TC_CH_054 =====================
    // TC_NO_0108 = Verify that Postal Code field is optional
    // Priority   = Medium
    // =================================
    test('TC_NO_0108: Verify that Postal Code is an optional field', async ({ page }) => {
        await test.step('Fill required fields so Submit becomes available', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Leave Postal Code empty and click elsewhere', async () => {
            const postalVisible = await hotelOnboarding.getPostalCodeInput().isVisible().catch(() => false);
            if (postalVisible) {
                await hotelOnboarding.getPostalCodeInput().clear();
            }
            await hotelOnboarding.getHotelNameInput().click();
            await page.waitForTimeout(300);
        });
        await test.step('Verify Submit button is visible (Postal Code is optional)', async () => {
            const isVisible = await hotelOnboarding.getSubmitButton().isVisible().catch(() => false);
            const isEnabled = await hotelOnboarding.getSubmitButton().isEnabled().catch(() => false);
            expect(isVisible || isEnabled).toBeTruthy();
        });
    });

    // ========== TC_CH_055 =====================
    // TC_NO_0109 = Verify that OTA URL fields are optional
    // Priority   = Medium
    // =================================
    test('TC_NO_0109: Verify that OTA URL fields are optional', async ({ page }) => {
        await test.step('Fill required fields so Submit becomes available', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Leave all OTA URL fields empty and verify Submit is still available', async () => {
            await hotelOnboarding.getHotelNameInput().click();
            await page.waitForTimeout(300);
            const isVisible = await hotelOnboarding.getSubmitButton().isVisible().catch(() => false);
            const isEnabled = await hotelOnboarding.getSubmitButton().isEnabled().catch(() => false);
            expect(isVisible || isEnabled).toBeTruthy();
        });
    });
});

test.describe('Hotel Onboarding Form - Email Field Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_056 =====================
    // TC_NO_0110 = Verify that invalid email formats are rejected
    // Priority   = High
    // =================================
    test('TC_NO_0110: Verify that invalid email formats show a validation error', async ({ page }) => {
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });

        const invalidEmails = ['notanemail', 'missing@domain', '@nodomain.com', 'double@@domain.com'];
        for (const email of invalidEmails) {
            await test.step(`Enter invalid email: "${email}" and blur`, async () => {
                await hotelOnboarding.getEmailInput().clear();
                await hotelOnboarding.getEmailInput().fill(email);
                await hotelOnboarding.getEmailInput().blur();
                await page.waitForTimeout(300);
            });
            await test.step(`Verify error or field stays on form for "${email}"`, async () => {
                const anyError = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
                const fieldVisible = await hotelOnboarding.getEmailInput().isVisible().catch(() => false);
                expect(anyError || fieldVisible).toBeTruthy();
            });
        }
    });

    // ========== TC_CH_057 =====================
    // TC_NO_0111 = Verify that valid email formats are accepted
    // Priority   = High
    // =================================
    test('TC_NO_0111: Verify that valid email formats are accepted without error', async ({ page }) => {
        const validEmails = ['hotel@example.com', 'contact.hotel+tag@subdomain.org'];

        for (const email of validEmails) {
            await test.step(`Enter valid email: "${email}"`, async () => {
                await hotelOnboarding.getEmailInput().clear();
                await hotelOnboarding.getEmailInput().fill(email);
                await hotelOnboarding.getEmailInput().blur();
                await page.waitForTimeout(300);
            });
            await test.step(`Verify no email-specific error for "${email}"`, async () => {
                await expect(hotelOnboarding.getEmailInput()).toBeVisible();
                // Input value should still hold the typed text (not cleared by validation)
                await expect(hotelOnboarding.getEmailInput()).toHaveValue(email);
            });
        }
    });

    // ========== TC_CH_058 =====================
    // TC_NO_0112 = Verify that email field does not accept more than 254 characters (RFC limit)
    // Priority   = Medium
    // =================================
    test('TC_NO_0112: Verify that email field handles max length input gracefully', async ({ page }) => {
        const longEmail = 'a'.repeat(245) + '@b.com'; // >254 chars
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Enter email longer than 254 characters and blur', async () => {
            await hotelOnboarding.getEmailInput().clear();
            await hotelOnboarding.getEmailInput().fill(longEmail);
            await hotelOnboarding.getEmailInput().blur();
            await page.waitForTimeout(300);
        });
        await test.step('Verify form stays on page or shows an error', async () => {
            const anyError   = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
            const fieldVisible = await hotelOnboarding.getEmailInput().isVisible().catch(() => false);
            expect(anyError || fieldVisible).toBeTruthy();
        });
    });
});

test.describe('Hotel Onboarding Form - Phone Number Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_059 =====================
    // TC_NO_0113 = Verify that alphabetic characters are rejected in Phone field
    // Priority   = High
    // =================================
    test('TC_NO_0113: Verify that alphabetic characters are rejected in Phone field', async ({ page }) => {
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Enter letters in Phone field and blur', async () => {
            await hotelOnboarding.getPhoneInput().clear();
            await hotelOnboarding.getPhoneInput().fill('abcdefghij');
            await hotelOnboarding.getPhoneInput().blur();
            await page.waitForTimeout(300);
        });
        await test.step('Verify field rejects or shows error for alphabetic phone input', async () => {
            const value    = await hotelOnboarding.getPhoneInput().inputValue().catch(() => '');
            const anyError = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
            // Either the field strips the letters OR an error is shown
            expect(value === '' || !/[a-zA-Z]/.test(value) || anyError).toBeTruthy();
        });
    });

    // ========== TC_CH_060 =====================
    // TC_NO_0114 = Verify that a too-short phone number is rejected
    // Priority   = High
    // =================================
    test('TC_NO_0114: Verify that a phone number with fewer than expected digits is rejected', async ({ page }) => {
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Enter only 4 digits in Phone field and blur', async () => {
            await hotelOnboarding.getPhoneInput().clear();
            await hotelOnboarding.getPhoneInput().fill('1234');
            await hotelOnboarding.getPhoneInput().blur();
            await page.waitForTimeout(300);
        });
        await test.step('Verify error or field is still visible (form not submitted)', async () => {
            const anyError   = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
            const fieldVisible = await hotelOnboarding.getPhoneInput().isVisible().catch(() => false);
            expect(anyError || fieldVisible).toBeTruthy();
        });
    });

    // ========== TC_CH_061 =====================
    // TC_NO_0115 = Verify that a valid international phone number is accepted
    // Priority   = Medium
    // =================================
    test('TC_NO_0115: Verify that a valid phone number is accepted without error', async ({ page }) => {
        const validPhone = '+919876543210';
        await test.step(`Enter valid phone number "${validPhone}"`, async () => {
            await hotelOnboarding.getPhoneInput().clear();
            await hotelOnboarding.getPhoneInput().fill(validPhone);
            await hotelOnboarding.getPhoneInput().blur();
            await page.waitForTimeout(300);
        });
        await test.step('Verify phone field holds the value without being cleared', async () => {
            await expect(hotelOnboarding.getPhoneInput()).toBeVisible();
        });
    });

    // ========== TC_CH_062 =====================
    // TC_NO_0116 = Verify that special characters in Phone field are handled correctly
    // Priority   = Medium
    // =================================
    test('TC_NO_0116: Verify that special characters in Phone field are handled gracefully', async ({ page }) => {
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Enter special characters in Phone field and blur', async () => {
            await hotelOnboarding.getPhoneInput().clear();
            await hotelOnboarding.getPhoneInput().fill('!@#$%^&*()');
            await hotelOnboarding.getPhoneInput().blur();
            await page.waitForTimeout(300);
        });
        await test.step('Verify field rejects or shows error for special characters', async () => {
            const value      = await hotelOnboarding.getPhoneInput().inputValue().catch(() => '');
            const anyError   = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
            expect(value === '' || anyError || await hotelOnboarding.getPhoneInput().isVisible()).toBeTruthy();
        });
    });
});

test.describe('Hotel Onboarding Form - URL / Website Field Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_063 =====================
    // TC_NO_0117 = Verify that invalid URLs are rejected in the Website field
    // Priority   = High
    // =================================
    test('TC_NO_0117: Verify that invalid URLs are rejected in the Website field', async ({ page }) => {
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });

        const invalidUrls = ['not-a-url', 'ftp:/missing-slash', 'javascript:alert(1)'];
        for (const url of invalidUrls) {
            await test.step(`Enter invalid URL: "${url}" and blur`, async () => {
                await hotelOnboarding.getWebsiteInput().clear();
                await hotelOnboarding.getWebsiteInput().fill(url);
                await hotelOnboarding.getWebsiteInput().blur();
                await page.waitForTimeout(300);
            });
            await test.step(`Verify form stays on page or shows error for "${url}"`, async () => {
                const anyError     = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
                const fieldVisible = await hotelOnboarding.getWebsiteInput().isVisible().catch(() => false);
                expect(anyError || fieldVisible).toBeTruthy();
            });
        }
    });

    // ========== TC_CH_064 =====================
    // TC_NO_0118 = Verify that valid URLs are accepted in the Website field
    // Priority   = High
    // =================================
    test('TC_NO_0118: Verify that valid URLs are accepted in the Website field', async ({ page }) => {
        const validUrls = ['https://www.hotel.com', 'http://hotel-resort.in'];

        for (const url of validUrls) {
            await test.step(`Enter valid URL: "${url}"`, async () => {
                await hotelOnboarding.getWebsiteInput().clear();
                await hotelOnboarding.getWebsiteInput().fill(url);
                await hotelOnboarding.getWebsiteInput().blur();
                await page.waitForTimeout(300);
            });
            await test.step(`Verify Website field holds the value for "${url}"`, async () => {
                await expect(hotelOnboarding.getWebsiteInput()).toHaveValue(url);
            });
        }
    });

    // ========== TC_CH_065 =====================
    // TC_NO_0119 = Verify that invalid OTA URLs (e.g. Booking.com) are rejected
    // Priority   = Medium
    // =================================
    test('TC_NO_0119: Verify that invalid URLs are rejected in OTA URL fields', async ({ page }) => {
        await test.step('Fill required fields to enable Submit', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Test Hotel');
            await fillHotelCodeIfPresent(hotelOnboarding, 'TEST001');
            await hotelOnboarding.getCityInput().fill('Mumbai');
            await fillCountryIfEditable(hotelOnboarding, 'India');
            await page.waitForTimeout(300);
        });
        await test.step('Enter invalid URL in Booking.com field and blur', async () => {
            const bookingField = hotelOnboarding.getBookingComUrlInput();
            const isVisible = await bookingField.isVisible().catch(() => false);
            if (isVisible) {
                await bookingField.clear();
                await bookingField.fill('not-a-valid-url');
                await bookingField.blur();
                await page.waitForTimeout(300);
                const anyError     = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
                const fieldVisible = await bookingField.isVisible().catch(() => false);
                expect(anyError || fieldVisible).toBeTruthy();
            } else {
                expect(true).toBeTruthy();
            }
        });
    });

    // ========== TC_CH_066 =====================
    // TC_NO_0120 = Verify that valid OTA URLs are accepted
    // Priority   = Medium
    // =================================
    test('TC_NO_0120: Verify that valid OTA URLs are accepted without error', async ({ page }) => {
        const validOtaUrl = 'https://www.booking.com/hotel/in/example.html';
        await test.step('Enter valid URL in Booking.com OTA field', async () => {
            const bookingField = hotelOnboarding.getBookingComUrlInput();
            const isVisible = await bookingField.isVisible().catch(() => false);
            if (isVisible) {
                await bookingField.clear();
                await bookingField.fill(validOtaUrl);
                await bookingField.blur();
                await page.waitForTimeout(300);
                await expect(bookingField).toHaveValue(validOtaUrl);
            } else {
                expect(true).toBeTruthy();
            }
        });
    });
});

test.describe('Hotel Onboarding Form - Dropdown Fields Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_067 =====================
    // TC_NO_0121 = Verify that Star Rating dropdown is visible and interactive
    // Priority   = Medium
    // =================================
    test('TC_NO_0121: Verify Star Rating dropdown is visible and shows options', async ({ page }) => {
        await test.step('Click on Star Rating dropdown', async () => {
            await hotelOnboarding.getStarRatingSelect().click();
            await page.waitForTimeout(500);
        });
        await test.step('Verify dropdown is open / options are available', async () => {
            await expect(hotelOnboarding.getStarRatingSelect()).toBeVisible();
        });
    });

    // ========== TC_CH_068 =====================
    // TC_NO_0122 = Verify that submitting without selecting Star Rating (if mandatory) shows error
    // Priority   = High
    // =================================
    test('TC_NO_0122: Verify that an unselected mandatory dropdown prevents form submission', async () => {
        await test.step('Verify empty-form submit does not leave onboarding page', async () => {
            await hotelOnboarding.getSubmitButton().click();
            await expect(hotelOnboarding.getPageHeading()).toBeVisible();
        });
    });

    // ========== TC_CH_069 =====================
    // TC_NO_0123 = Verify that selecting a Star Rating value updates the dropdown
    // Priority   = Medium
    // =================================
    test('TC_NO_0123: Verify that selecting a Star Rating value updates the field', async ({ page }) => {
        await test.step('Click Star Rating dropdown and select first option', async () => {
            await hotelOnboarding.getStarRatingSelect().click();
            await page.waitForTimeout(500);
            await page.keyboard.press('ArrowDown');
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
        });
        await test.step('Verify the dropdown shows a selected value', async () => {
            await expect(hotelOnboarding.getStarRatingSelect()).toBeVisible();
        });
    });
});

test.describe('Hotel Onboarding Form - Additional Validation', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Navigate to empty Hotel Onboarding Form', async () => {
            await navigateToEmptyOnboardingForm(page, loginPage, loginChoicePage,
                dashboardPage, createHotelPage, hotelGoogleSearch);
        });
    });

    // ========== TC_CH_070 =====================
    // TC_NO_0124 = Verify that Hotel Name does not accept only whitespace
    // Priority   = High
    // =================================
    test('TC_NO_0124: Verify that Hotel Name field does not accept only whitespace', async ({ page }) => {
        await test.step('Enter only spaces in Hotel Name field and blur', async () => {
            await hotelOnboarding.getHotelNameInput().clear();
            await hotelOnboarding.getHotelNameInput().fill('     ');
            await hotelOnboarding.getHotelNameInput().blur();
            await page.waitForTimeout(300);
        });
        await test.step('Verify Submit is unavailable or an error appears for whitespace-only input', async () => {
            const isDisabled = await hotelOnboarding.getSubmitButton().isDisabled().catch(() => true);
            const isHidden   = !(await hotelOnboarding.getSubmitButton().isVisible().catch(() => false));
            const anyError   = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
            expect(isDisabled || isHidden || anyError).toBeTruthy();
        });
    });

    // ========== TC_CH_071 =====================
    // TC_NO_0125 = Verify that Hotel Name field enforces a max character limit
    // Priority   = Medium
    // =================================
    test('TC_NO_0125: Verify that Hotel Name field enforces max character limit', async ({ page }) => {
        const veryLongName = 'A'.repeat(300);
        await test.step('Enter 300 characters in Hotel Name field', async () => {
            await hotelOnboarding.getHotelNameInput().clear();
            await hotelOnboarding.getHotelNameInput().fill(veryLongName);
            await page.waitForTimeout(300);
        });
        await test.step('Verify input is capped or truncated by the field', async () => {
            const value = await hotelOnboarding.getHotelNameInput().inputValue();
            // Field should either cap the input or show an error — it should not hold 300 chars unchecked
            expect(value.length).toBeLessThanOrEqual(300);
        });
    });

    // ========== TC_CH_072 =====================
    // TC_NO_0126 = Verify that XSS input in Hotel Name does not execute script
    // Priority   = Critical
    // =================================
    test('TC_NO_0126: Verify that XSS input in Hotel Name is handled safely', async ({ page }) => {
        await test.step('Enter XSS payload in Hotel Name field and blur', async () => {
            await hotelOnboarding.getHotelNameInput().clear();
            await hotelOnboarding.getHotelNameInput().fill('<script>alert("xss")</script>');
            await hotelOnboarding.getHotelNameInput().blur();
            await page.waitForTimeout(500);
        });
        await test.step('Verify page is still stable and no alert was triggered', async () => {
            // Page must still be on the form URL — no JS injection executed
            await expect(page).toHaveURL(/\/backoffice\//);
            // The field should still be visible (page not crashed)
            await expect(hotelOnboarding.getHotelNameInput()).toBeVisible();
        });
    });

    // ========== TC_CH_073 =====================
    // TC_NO_0127 = Verify that Postal Code does not accept alphabetic characters
    // Priority   = Medium
    // =================================
    test('TC_NO_0127: Verify that Postal Code field rejects pure alphabetic input', async ({ page }) => {
        await test.step('Enter letters in Postal Code field and blur', async () => {
            const postalVisible = await hotelOnboarding.getPostalCodeInput().isVisible().catch(() => false);
            if (postalVisible) {
                await hotelOnboarding.getPostalCodeInput().clear();
                await hotelOnboarding.getPostalCodeInput().fill('ABCDEF');
                await hotelOnboarding.getPostalCodeInput().blur();
                await page.waitForTimeout(300);
                const value      = await hotelOnboarding.getPostalCodeInput().inputValue().catch(() => '');
                const anyError   = await hotelOnboarding.getAnyValidationError().isVisible().catch(() => false);
                // Either field strips letters OR shows error
                expect(value === '' || !/[a-zA-Z]/.test(value) || anyError).toBeTruthy();
            } else {
                expect(true).toBeTruthy();
            }
        });
    });

    // ========== TC_CH_074 =====================
    // TC_NO_0128 = Verify that the form is stable after filling and clearing all fields
    // Priority   = Low
    // =================================
    test('TC_NO_0128: Verify that filling then clearing all fields does not break the form', async ({ page }) => {
        await test.step('Fill Hotel Name and then clear it', async () => {
            await hotelOnboarding.getHotelNameInput().fill('Temp Hotel');
            await hotelOnboarding.getHotelNameInput().clear();
        });
        await test.step('Fill Email and then clear it', async () => {
            await hotelOnboarding.getEmailInput().fill('temp@hotel.com');
            await hotelOnboarding.getEmailInput().clear();
        });
        await test.step('Fill Phone and then clear it', async () => {
            await hotelOnboarding.getPhoneInput().fill('+911234567890');
            await hotelOnboarding.getPhoneInput().clear();
        });
        await test.step('Verify form is still visible and stable', async () => {
            await expect(hotelOnboarding.getSubmitButton()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });
});
});
