export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api/v1',
    TIMEOUT: 10000,
    WITH_CREDENTIALS: true,
};

export const AUTH_MESSAGES = {
    LOGIN_SUCCESS: 'Welcome back!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'Account created successfully!',
    SESSION_EXPIRED: 'Session expired. Please login again.',
    NETWORK_ERROR: 'Network error. Please check your connection',
    SERVER_ERROR: 'Server error. Please try again later',
};

export const VALIDATION = {
    MIN_PASSWORD_LENGTH: 6,
    MAX_USERNAME_LENGTH: 30,
    MAX_BIO_LENGTH: 150,
};