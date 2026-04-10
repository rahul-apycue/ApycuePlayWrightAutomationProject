/**
 * TEST DATA — Centralized constants for all spec files
 *
 * COMPARISON WITH SELENIUM:
 * Selenium  → TestData.java / config.properties / Excel DataProvider
 * Playwright → test-data.ts (TypeScript constants — type-safe and auto-completed)
 *
 * HOW TO USE IN A SPEC FILE:
 *   import { CREDENTIALS, SEARCH, URLS } from './test-data';
 *   await loginPage.login(CREDENTIALS.admin.email, CREDENTIALS.admin.password);
 */

// ==================== CREDENTIALS ====================

export const CREDENTIALS = {
    admin: {
        email:    process.env.LOGIN_EMAIL!,
        password: process.env.LOGIN_PASSWORD!,
    },
    restricted: {
        email:    process.env.RESTRICTED_USER_EMAIL!,
        password: process.env.RESTRICTED_USER_PASSWORD!,
    },
    nonAdmin: {
        email:    process.env.NON_ADMIN_USER_EMAIL!,
        password: process.env.NON_ADMIN_USER_PASSWORD!,
    },
};

// ==================== APPLICATION URLS ====================

export const URLS = {
    login:              '/backoffice/login',
    loginChoice:        '/backoffice/login-choice',
    dashboard:          '/backoffice/dashboard',
    createHotel:        '/backoffice/create-hotel',
    manageHotels:       '/backoffice/manage-hotels',
    users:              '/backoffice/users',
    manageResellers:    '/backoffice/manage-resellers',
    whiteLabelPartner:  '/backoffice/white-label-partner',
    viewHotel:          '/backoffice/view-hotel',
    manageMedia:        '/backoffice/manage-media',
    taskStatus:         '/backoffice/task-status',
};

// URL regex patterns — used with expect(page).toHaveURL(PATTERNS.login)
export const PATTERNS = {
    login:              /\/backoffice\/login/,
    loginChoice:        /\/backoffice\/login-choice/,
    dashboard:          /\/backoffice\/dashboard/,
    createHotel:        /\/backoffice\/create-hotel/,
    manageHotels:       /\/backoffice\/manage-hotels/,
    users:              /\/backoffice\/users/,
    manageResellers:    /\/backoffice\/manage-resellers/,
    whiteLabelPartner:  /\/backoffice\/white-label/,
    viewHotel:          /\/backoffice\/view-hotel/,
    manageMedia:        /\/backoffice\/manage-media/,
    taskStatus:         /\/backoffice\/task-status/,
    backoffice:         /\/backoffice\//,
};

// ==================== SEARCH TERMS ====================

export const SEARCH = {
    tenant: {
        valid:          'new',
        byCity:         'Mumbai',
        combined:       'Marriott Mumbai',
        nonExistent:    'xyznonexistenthotel12345',
        specialChars:   '!@#$%',
        xss:            '<script>alert(1)</script>',
        longString:     'a'.repeat(100),
    },
    hotel: {
        byName:         'Taj Mahal Hotel',
        byCity:         'udaipur',
        byState:        'Maharashtra',
        byCountry:      'India',
        combined:       'Marriott Mumbai',
        nonExistent:    'xyznonexistenthotel12345',
    },
    hotelLogin: {
        byCode:         '3',
        byName:         'Marriott',
        byCity:         'Mumbai',
        partial:        'Mar',
        nonExistent:    'xyznonexistent12345',
    },
};

// ==================== VALIDATION TEST DATA ====================

export const VALIDATION = {
    email: {
        valid: [
            'hotel@example.com',
            'contact.hotel+tag@subdomain.org',
        ],
        invalid: [
            'notanemail',
            'missing@domain',
            '@nodomain.com',
            'double@@domain.com',
        ],
        tooLong: 'a'.repeat(245) + '@b.com',
    },
    phone: {
        valid:          '+919876543210',
        tooShort:       '1234',
        letters:        'abcdefghij',
        specialChars:   '!@#$%^&*()',
    },
    url: {
        valid: [
            'https://www.hotel.com',
            'http://hotel-resort.in',
        ],
        invalid: [
            'not-a-url',
            'ftp:/missing-slash',
            'http://',
            'javascript:alert(1)',
        ],
        otaValid:   'https://www.booking.com/hotel/in/example.html',
        otaInvalid: 'not-a-valid-url',
    },
    hotelName: {
        valid:          'Test Hotel Name',
        whitespaceOnly: '     ',
        xss:            '<script>alert("xss")</script>',
        tooLong:        'A'.repeat(300),
    },
    postalCode: {
        valid:      '400001',
        letters:    'ABCDEF',
    },
};

// ==================== EXPECTED PAGE TEXT ====================

export const TEXT = {
    login: {
        heading:    'Backoffice Login',
        subtext:    'Sign in to access your account',
        emailPlaceholder:    'Enter your email',
        passwordPlaceholder: 'Enter your password',
    },
    loginChoice: {
        heading:    'Select Login Type',
        subtext:    'Choose where you want to login',
    },
    dashboard: {
        welcomeHeading: 'Welcome back, Backoffice!',
        subtext:        'Backoffice Administration Dashboard',
    },
    createHotel: {
        heading:        'Create Hotel',
        searchHeading:  'Search for Tenant',
        searchSubtext:  'Search by tenant name, hotel code, or hotel name',
        placeholder:    'Enter tenant name...',
    },
    hotelGoogleSearch: {
        heading:    'Search Hotel',
        subtext:    'Find your hotel on Google to auto-fill details, or create manually',
        placeholder:'Search hotel name or location...',
    },
    hotelSearch: {
        heading:    'Hotel Login',
        subtext:    'Search and click on a hotel to login instantly',
        placeholder:'Search by name, code, or city...',
    },
};

// ==================== MENU ITEMS ====================

export const MENU = {
    adminOnly:      ['Create Hotel', 'User Management', 'Manage Reseller'],
    restrictedOnly: ['Manage Hotels', 'White Label Partner', 'View Hotel', 'Manage Media', 'Task Status'],
    all: [
        'Create Hotel', 'Manage Hotels', 'User Management',
        'Manage Reseller', 'White Label Partner', 'View Hotel',
        'Manage Media', 'Task Status',
    ],
};
