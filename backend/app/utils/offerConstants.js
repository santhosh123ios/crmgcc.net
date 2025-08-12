// Offer Redemption Status Constants
export const OFFER_REDEEM_STATUS = {
    ACTIVE: '0',      // Offer is active and available
    USED: '1',        // Offer has been used/redeemed
    EXPIRED: '2',     // Offer has expired
    CANCELLED: '3'    // Offer was cancelled
};

// Offer Status Constants
export const OFFER_STATUS = {
    INACTIVE: '0',    // Offer is inactive
    ACTIVE: '1'       // Offer is active
};

// Database Table Names
export const TABLES = {
    OFFERS: 'offers',
    OFFER_REDEEM: 'offer_redeem',
    USERS: 'users',
    VENDORS: 'vendors'
};

// API Response Messages
export const MESSAGES = {
    OFFER_ALREADY_USED: 'This offer has already been used',
    OFFER_MARKED_SUCCESS: 'Offer marked as used successfully',
    OFFER_VALID: 'Offer code is valid',
    OFFER_INVALID: 'Invalid or expired offer',
    OFFER_NOT_FOUND: 'Offer not found',
    UNAUTHORIZED: 'Unauthorized to mark this offer as used',
    USER_ID_MISMATCH: 'Offer code was generated for a different user',
    MISSING_PARAMS: 'Missing required parameters',
    DATABASE_ERROR: 'Database error'
};

// API Response Status Codes
export const STATUS_CODES = {
    SUCCESS: 1,
    ERROR: 0
};
