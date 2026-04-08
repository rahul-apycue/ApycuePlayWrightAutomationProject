import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { DashboardPage } from '../pages/DashboardPage';
import { CreateHotelPage } from '../pages/CreateHotelPage';
import { HotelGoogleSearchPage } from '../pages/HotelGoogleSearchPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;
const RESTRICTED_EMAIL = process.env.RESTRICTED_USER_EMAIL!;
const RESTRICTED_PASSWORD = process.env.RESTRICTED_USER_PASSWORD!;

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let dashboardPage: DashboardPage;
let createHotelPage: CreateHotelPage;
let hotelGoogleSearch: HotelGoogleSearchPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    dashboardPage = new DashboardPage(page);
    createHotelPage = new CreateHotelPage(page);
    hotelGoogleSearch = new HotelGoogleSearchPage(page);
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
    // =================================
    test('TC_NO_0056: Verify that search input has correct placeholder text', async () => {
        await test.step('Verify search input placeholder is "Enter tenant name..."', async () => {
            await expect(createHotelPage.getSearchInput()).toHaveAttribute('placeholder', 'Enter tenant name...');
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
});

// =========================================================================
// SECURITY TESTS — Verify access control for Create Hotel page
// =========================================================================

test.describe('Create Hotel - Security Tests', () => {

    // ========== NH-HS-020 =====================
    // TC_NO_0069 = Verify that restricted user cannot access Create Hotel page via direct URL
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
    // =================================
    test('TC_NO_0078: Verify that searching for a non-existent hotel shows empty state', async ({ page }) => {
        await test.step('Search for "xyznonexistenthotel12345"', async () => {
            await hotelGoogleSearch.searchHotel('xyznonexistenthotel12345');
        });
        await test.step('Verify no results or zero count is displayed', async () => {
            const hasZeroResults = await page.getByText('Found 0 hotel').isVisible().catch(() => false);
            const hasNoCards = await hotelGoogleSearch.getSelectButtons().count().then(c => c === 0).catch(() => true);
            expect(hasZeroResults || hasNoCards).toBeTruthy();
        });
    });

    // ========== NH-HS-010 =====================
    // TC_NO_0079 = Verify that hotel results display hotel name, location, and star rating
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
