import { Page, Locator } from '@playwright/test';

export class HotelOnboardingPage {

    private page: Page;

    // Page header
    private pageHeading: Locator;
    private tenantBadge: Locator;
    private backToSearchButton: Locator;

    // Basic Information section
    private basicInfoHeading: Locator;
    private hotelNameInput: Locator;
    private hotelCodeInput: Locator;
    private starRatingSelect: Locator;
    private descriptionTextarea: Locator;

    // Address Information section
    private addressHeading: Locator;
    private addressLine1Input: Locator;
    private cityInput: Locator;
    private stateInput: Locator;
    private countryInput: Locator;
    private postalCodeInput: Locator;

    // Contact Information section
    private contactHeading: Locator;
    private phoneInput: Locator;
    private emailInput: Locator;
    private websiteInput: Locator;

    // OTA URL fields (Contact / OTA section)
    private bookingComUrlInput: Locator;
    private expediaUrlInput: Locator;
    private airbnbUrlInput: Locator;
    private agodaUrlInput: Locator;
    private tripadvisorUrlInput: Locator;

    // Form action buttons
    private submitButton: Locator;
    private cancelButton: Locator;

    // Toast notifications
    private successToast: Locator;
    private errorToast: Locator;

    constructor(page: Page) {
        this.page = page;

        // Page header
        this.pageHeading = page.getByRole('heading', { name: /Hotel Onboarding Form/i });
        this.tenantBadge = page.locator('.rounded-full').filter({ hasText: 'Tenant:' });
        this.backToSearchButton = page.getByRole('button', { name: /Back|Back to Search/i });

        // Basic Information
        this.basicInfoHeading = page.getByRole('heading', { name: /Basic Information/i });
        this.hotelNameInput = page.getByLabel(/Hotel Name/i);
        this.hotelCodeInput = page.getByLabel(/Hotel Code/i);
        this.starRatingSelect = page
            .locator('label:has-text("Star Rating")')
            .locator('xpath=following::*[@role="combobox" or self::select][1]');
        this.descriptionTextarea = page.getByLabel(/Description/i);

        // Address Information
        this.addressHeading = page.getByText('Address Information').first();
        this.addressLine1Input = page.getByLabel(/Address/i).first();
        this.cityInput = page.getByLabel(/City/i);
        this.stateInput = page.getByLabel(/State/i);
        this.countryInput = page.getByText(/^Country\*?$/).first();
        this.postalCodeInput = page.getByLabel(/Postal Code|ZIP/i);

        // Contact Information
        this.contactHeading = page.getByText('Contact Information').first();
        this.phoneInput = page.getByLabel(/^Phone 1$/i);
        this.emailInput = page.getByLabel(/^Email 1$/i);
        this.websiteInput = page.getByLabel(/Website URL|Website/i);

        // OTA URL fields
        this.bookingComUrlInput = page.getByLabel(/Booking\.com/i);
        this.expediaUrlInput = page.getByLabel(/Expedia/i);
        this.airbnbUrlInput = page.getByLabel(/Airbnb/i);
        this.agodaUrlInput = page.getByLabel(/Agoda/i);
        this.tripadvisorUrlInput = page.getByLabel(/TripAdvisor/i);

        // Form actions
        this.submitButton = page.getByRole('button', { name: /Submit|Create Hotel|Save/i });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });

        // Toasts
        this.successToast = page.getByText(/Hotel created|created successfully|success/i);
        this.errorToast = page.getByText(/error|failed|required/i).first();
    }

    // ─── Page header ───────────────────────────────────────────────────────────

    getPageHeading() { return this.pageHeading; }
    getTenantBadge() { return this.tenantBadge; }
    getBackToSearchButton() { return this.backToSearchButton; }

    // ─── Basic Information ──────────────────────────────────────────────────────

    getBasicInfoHeading() { return this.basicInfoHeading; }
    getHotelNameInput() { return this.hotelNameInput; }
    getHotelCodeInput() { return this.hotelCodeInput; }
    getStarRatingSelect() { return this.starRatingSelect; }
    getDescriptionTextarea() { return this.descriptionTextarea; }

    // ─── Address Information ────────────────────────────────────────────────────

    getAddressHeading() { return this.addressHeading; }
    getAddressLine1Input() { return this.addressLine1Input; }
    getCityInput() { return this.cityInput; }
    getStateInput() { return this.stateInput; }
    getCountryInput() { return this.countryInput; }
    getPostalCodeInput() { return this.postalCodeInput; }

    // ─── Contact Information ────────────────────────────────────────────────────

    getContactHeading() { return this.contactHeading; }
    getPhoneInput() { return this.phoneInput; }
    getEmailInput() { return this.emailInput; }
    getWebsiteInput() { return this.websiteInput; }

    // ─── OTA URL fields ─────────────────────────────────────────────────────────

    getBookingComUrlInput() { return this.bookingComUrlInput; }
    getExpediaUrlInput() { return this.expediaUrlInput; }
    getAirbnbUrlInput() { return this.airbnbUrlInput; }
    getAgodaUrlInput() { return this.agodaUrlInput; }
    getTripadvisorUrlInput() { return this.tripadvisorUrlInput; }

    // Generic OTA input by name — covers any OTA not listed above
    getOtaUrlInput(otaName: string) {
        return this.page.getByLabel(new RegExp(otaName, 'i'));
    }

    // ─── Form actions ────────────────────────────────────────────────────────────

    getSubmitButton() { return this.submitButton; }
    getCancelButton() { return this.cancelButton; }

    // ─── Toasts ──────────────────────────────────────────────────────────────────

    getSuccessToast() { return this.successToast; }
    getErrorToast() { return this.errorToast; }

    // ─── Validation helpers ───────────────────────────────────────────────────────

    /**
     * Returns the inline validation error message associated with a field label.
     * Playwright queries the element that follows the label in the DOM.
     */
    getFieldError(fieldLabel: string) {
        return this.page.locator(`text=${fieldLabel}`).locator('..').getByRole('alert');
    }

    /**
     * Generic: find any visible error/validation text on the page.
     */
    getAnyValidationError() {
        return this.page.locator('[role="alert"], .text-red-500, .text-destructive, [class*="error"]').first();
    }

    /**
     * Section heading by regex — useful when the exact label isn't known.
     */
    getSectionHeading(name: string) {
        return this.page.getByRole('heading', { name: new RegExp(name, 'i') });
    }
}
