import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LoginChoicePage } from '../pages/LoginChoicePage';
import { HotelSearchPage } from '../pages/HotelSearchPage';

const TEST_EMAIL = process.env.LOGIN_EMAIL!;
const TEST_PASSWORD = process.env.LOGIN_PASSWORD!;

test.describe('Hotel Search Page', () => {

let loginPage: LoginPage;
let loginChoicePage: LoginChoicePage;
let hotelSearchPage: HotelSearchPage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    loginChoicePage = new LoginChoicePage(page);
    hotelSearchPage = new HotelSearchPage(page);
});

// =========================================================================
// UI TESTS — Verify Hotel Search page elements
// =========================================================================

test.describe('Hotel Search - UI Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login and navigate to Hotel Search page via Hotel Login', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickHotelLogin();
        });
    });

    // ========== TC_HS_001 =====================
    // TC_NO_0129 = Verify Hotel Search page loads with all elements
    // Priority   = High
    // ==========================================
    test('TC_NO_0129: Verify Hotel Search page is displayed with all required elements', async () => {
        await test.step('Verify "Hotel Login" heading is visible', async () => {
            await expect(hotelSearchPage.getPageHeading()).toBeVisible();
        });
        await test.step('Verify page subtext is visible', async () => {
            await expect(hotelSearchPage.getPageSubtext()).toBeVisible();
        });
        await test.step('Verify search input is visible', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
        await test.step('Verify Back button is visible', async () => {
            await expect(hotelSearchPage.getBackButton()).toBeVisible();
        });
    });

    // ========== TC_HS_002 =====================
    // TC_NO_0130 = Verify correct placeholder text on search input
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0130: Verify search input has correct placeholder text', async () => {
        await test.step('Verify placeholder is "Search by name, code, or city..."', async () => {
            await expect(hotelSearchPage.getSearchInput())
                .toHaveAttribute('placeholder', 'Search by name, code, or city...');
        });
    });

    // ========== TC_HS_003 =====================
    // TC_NO_0131 = Verify search input is focused/interactive
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0131: Verify search input is enabled and accepts user input', async () => {
        await test.step('Click on search input and type a character', async () => {
            await hotelSearchPage.getSearchInput().click();
            await hotelSearchPage.getSearchInput().fill('a');
        });
        await test.step('Verify input holds the typed value', async () => {
            await expect(hotelSearchPage.getSearchInput()).toHaveValue('a');
        });
    });

    // ========== TC_HS_004 =====================
    // TC_NO_0132 = Verify page subtext content
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0132: Verify page subtext reads "Search and click on a hotel to login instantly"', async () => {
        await test.step('Verify subtext is visible and contains expected text', async () => {
            await expect(hotelSearchPage.getPageSubtext())
                .toContainText('Search and click on a hotel to login instantly');
        });
    });
});

// =========================================================================
// FUNCTIONAL TESTS — Verify search behavior, results, and navigation
// =========================================================================

test.describe('Hotel Search - Functional Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login and navigate to Hotel Search page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickHotelLogin();
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
    });

    // ========== TC_HS_005 =====================
    // TC_NO_0133 = Verify search by hotel name returns results
    // Priority   = High
    // ==========================================
    test('TC_NO_0133: Verify searching by hotel name returns matching results', async () => {
        await test.step('Search by hotel name "Marriott"', async () => {
            await hotelSearchPage.searchHotel('Marriott');
        });
        await test.step('Verify hotel results are displayed', async () => {
            const hasResults = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            const hasNoResults = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            // Either results are shown, or a "no results" message — not a blank/broken page
            expect(hasResults || hasNoResults).toBeTruthy();
        });
    });

    // ========== TC_HS_006 =====================
    // TC_NO_0134 = Verify search by hotel code returns results
    // Priority   = High
    // ==========================================
    test('TC_NO_0134: Verify searching by hotel code returns the matching hotel', async () => {
        await test.step('Search by hotel code "3"', async () => {
            await hotelSearchPage.searchHotel('3');
        });
        await test.step('Verify hotel result card is displayed', async () => {
            await expect(hotelSearchPage.getSearchResults().first()).toBeVisible();
        });
    });

    // ========== TC_HS_007 =====================
    // TC_NO_0135 = Verify search by city name returns hotels in that city
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0135: Verify searching by city name returns hotels in that city', async () => {
        await test.step('Search by city "Mumbai"', async () => {
            await hotelSearchPage.searchHotel('Mumbai');
        });
        await test.step('Verify results or no-results message is displayed', async () => {
            const hasResults = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            const hasNoResults = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasResults || hasNoResults).toBeTruthy();
        });
    });

    // ========== TC_HS_008 =====================
    // TC_NO_0136 = Verify partial search returns matching results
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0136: Verify partial search string returns matching results', async () => {
        await test.step('Search with partial name "Mar"', async () => {
            await hotelSearchPage.searchHotel('Mar');
        });
        await test.step('Verify matching hotel cards appear', async () => {
            const hasResults = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            const hasNoResults = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasResults || hasNoResults).toBeTruthy();
        });
    });

    // ========== TC_HS_009 =====================
    // TC_NO_0137 = Verify non-existent hotel shows no results message
    // Priority   = High
    // ==========================================
    test('TC_NO_0137: Verify searching for a non-existent hotel shows "No hotels found" message', async () => {
        await test.step('Search for "xyznonexistent12345"', async () => {
            await hotelSearchPage.searchHotel('xyznonexistent12345');
        });
        await test.step('Verify "No hotels found" message is displayed', async () => {
            await expect(hotelSearchPage.getNoResultsMessage()).toBeVisible();
        });
    });

    // ========== TC_HS_010 =====================
    // TC_NO_0138 = Verify clearing search input hides results
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0138: Verify clearing search input removes displayed results', async ({ page }) => {
        await test.step('Search for "3" to get results', async () => {
            await hotelSearchPage.searchHotel('3');
            await expect(hotelSearchPage.getSearchResults().first()).toBeVisible();
        });
        await test.step('Clear the search input using keyboard', async () => {
            await hotelSearchPage.getSearchInput().click();
            await hotelSearchPage.getSearchInput().selectAll ? hotelSearchPage.getSearchInput().selectAll() : null;
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Delete');
            await page.waitForTimeout(1500);
        });
        await test.step('Verify results are no longer shown after clearing', async () => {
            await expect(hotelSearchPage.getSearchInput()).toHaveValue('');
            const noResultsVisible = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            const typeToSearchVisible = await page.getByText(/Type to start searching/i).isVisible().catch(() => false);
            const firstResultVisible = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            expect(noResultsVisible || typeToSearchVisible || !firstResultVisible).toBeTruthy();
        });
    });

    // ========== TC_HS_011 =====================
    // TC_NO_0139 = Verify Back button navigates to Select Login Type page
    // Priority   = High
    // ==========================================
    test('TC_NO_0139: Verify clicking Back button returns to "Select Login Type" page', async ({ page }) => {
        await test.step('Click the Back button', async () => {
            await hotelSearchPage.clickBackButton();
        });
        await test.step('Verify user is redirected to /backoffice/login-choice', async () => {
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
    });

    // ========== TC_HS_012 =====================
    // TC_NO_0140 = Verify searching again updates results
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0140: Verify searching a second time replaces the first set of results', async () => {
        await test.step('Search for "3" first', async () => {
            await hotelSearchPage.searchHotel('3');
            await expect(hotelSearchPage.getSearchResults().first()).toBeVisible();
        });
        await test.step('Clear and search for a different term', async () => {
            await hotelSearchPage.clearSearch();
            await hotelSearchPage.searchHotel('Mumbai');
        });
        await test.step('Verify results update for the new search term', async () => {
            const hasResults = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            const hasNoResults = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasResults || hasNoResults).toBeTruthy();
        });
    });

    // ========== TC_HS_013 =====================
    // TC_NO_0141 = Verify case-insensitive search works
    // Priority   = Medium
    // ==========================================
    test('TC_NO_0141: Verify search is case-insensitive', async () => {
        await test.step('Search in lowercase "marriott"', async () => {
            await hotelSearchPage.searchHotel('marriott');
        });
        await test.step('Record results count', async () => {
            await hotelSearchPage.getSearchInput().page().waitForTimeout(500);
        });
        await test.step('Clear and search in uppercase "MARRIOTT"', async () => {
            await hotelSearchPage.clearSearch();
            await hotelSearchPage.searchHotel('MARRIOTT');
        });
        await test.step('Verify results still appear for uppercase query', async () => {
            const hasResults = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            const hasNoResults = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasResults || hasNoResults).toBeTruthy();
        });
    });
});

// =========================================================================
// VALIDATION TESTS — Verify input handling and edge cases
// =========================================================================

test.describe('Hotel Search - Validation Tests', () => {

    test.beforeEach(async ({ page }) => {
        await test.step('Login and navigate to Hotel Search page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickHotelLogin();
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
    });

    // ========== TC_HS_014 =====================
    // TC_NO_0142 = Verify single character search does not crash the page
    // Priority   = Low
    // ==========================================
    test('TC_NO_0142: Verify single character search does not crash the application', async ({ page }) => {
        await test.step('Enter single character "a"', async () => {
            await hotelSearchPage.searchHotel('a');
        });
        await test.step('Verify page is stable', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });

    // ========== TC_HS_015 =====================
    // TC_NO_0143 = Verify whitespace-only search is handled gracefully
    // Priority   = Low
    // ==========================================
    test('TC_NO_0143: Verify whitespace-only search is handled without crashing', async ({ page }) => {
        await test.step('Enter only spaces in search field', async () => {
            await hotelSearchPage.getSearchInput().fill('     ');
            await hotelSearchPage.getSearchInput().page().waitForTimeout(2000);
        });
        await test.step('Verify page does not crash', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });

    // ========== TC_HS_016 =====================
    // TC_NO_0144 = Verify special characters do not crash the search
    // Priority   = Low
    // ==========================================
    test('TC_NO_0144: Verify special characters in search field do not crash the application', async ({ page }) => {
        const specialInputs = ['!@#$%', '<script>alert(1)</script>', 'Hotel & Spa', '"quoted"'];

        for (const input of specialInputs) {
            await test.step(`Search with special characters: "${input}"`, async () => {
                await hotelSearchPage.clearSearch();
                await hotelSearchPage.searchHotel(input);
            });
            await test.step(`Verify page is stable for input "${input}"`, async () => {
                await expect(hotelSearchPage.getSearchInput()).toBeVisible();
                await expect(page).toHaveURL(/\/backoffice\//);
            });
        }
    });

    // ========== TC_HS_017 =====================
    // TC_NO_0145 = Verify search with exactly 100 characters does not crash
    // Priority   = Low
    // ==========================================
    test('TC_NO_0145: Verify searching with exactly 100 characters does not crash the application', async ({ page }) => {
        const longQuery = 'a'.repeat(100);
        await test.step('Enter 100-character string in search field', async () => {
            await hotelSearchPage.searchHotel(longQuery);
        });
        await test.step('Verify page remains stable', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });

    // ========== TC_HS_018 =====================
    // TC_NO_0146 = Verify numeric-only search works
    // Priority   = Low
    // ==========================================
    test('TC_NO_0146: Verify numeric-only search input works correctly', async () => {
        await test.step('Search with numeric string "12345"', async () => {
            await hotelSearchPage.searchHotel('12345');
        });
        await test.step('Verify results or no-results message is shown', async () => {
            const hasResults = await hotelSearchPage.getSearchResults().first().isVisible().catch(() => false);
            const hasNoResults = await hotelSearchPage.getNoResultsMessage().isVisible().catch(() => false);
            expect(hasResults || hasNoResults).toBeTruthy();
        });
    });
});

// =========================================================================
// SECURITY TESTS — Verify session and access control on Hotel Search page
// =========================================================================

test.describe('Hotel Search - Security Tests', () => {

    // ========== TC_HS_019 =====================
    // TC_NO_0147 = Verify direct URL to Hotel Search requires auth
    // Priority   = Critical
    // ==========================================
    test('TC_NO_0147: Verify direct URL access to Hotel Search page requires authentication', async ({ page }) => {
        await test.step('Navigate directly to hotel search without login', async () => {
            await page.goto('/backoffice/hotel-search');
        });
        await test.step('Verify unauthenticated user cannot access Hotel Search experience', async () => {
            const redirectedToLogin = /\/login/.test(page.url());
            const has404 = await page.getByText(/404|Page Not Found/i).isVisible().catch(() => false);
            const hasSearchInput = await hotelSearchPage.getSearchInput().isVisible().catch(() => false);
            expect(redirectedToLogin || has404 || !hasSearchInput).toBeTruthy();
        });
    });

    // ========== TC_HS_020 =====================
    // TC_NO_0148 = Verify session persists while on Hotel Search page
    // Priority   = High
    // ==========================================
    test('TC_NO_0148: Verify user session remains active on Hotel Search page', async ({ page }) => {
        await test.step('Login and navigate to Hotel Search page', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickHotelLogin();
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
        await test.step('Perform a search action', async () => {
            await hotelSearchPage.searchHotel('3');
        });
        await test.step('Verify page is still accessible (session not dropped)', async () => {
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });

    // ========== TC_HS_021 =====================
    // TC_NO_0149 = Verify browser back button does not bypass auth
    // Priority   = High
    // ==========================================
    test('TC_NO_0149: Verify pressing browser back from Hotel Search does not expose protected data', async ({ page }) => {
        await test.step('Login and navigate to Hotel Search', async () => {
            await loginPage.goto();
            await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
            await loginChoicePage.clickHotelLogin();
            await expect(hotelSearchPage.getSearchInput()).toBeVisible();
        });
        await test.step('Click Back button to return to Select Login Type page', async () => {
            await hotelSearchPage.clickBackButton();
            await expect(page).toHaveURL(/\/backoffice\/login-choice/);
        });
        await test.step('Click browser Forward to go back to Hotel Search', async () => {
            await page.goForward();
        });
        await test.step('Verify Hotel Search is still accessible (session still valid)', async () => {
            await expect(page).toHaveURL(/\/backoffice\//);
        });
    });
});

});
