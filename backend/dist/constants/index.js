"use strict";
/**
 * Application Constants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.API_CONSTANTS = exports.NLP_CONSTANTS = exports.CORS_CONSTANTS = exports.RATE_LIMIT_CONSTANTS = exports.JWT_CONSTANTS = exports.FILE_CONSTANTS = void 0;
exports.FILE_CONSTANTS = {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
    ALLOWED_EXTENSIONS: (process.env.ALLOWED_EXTENSIONS || 'pdf,docx').split(','),
    UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
};
exports.JWT_CONSTANTS = {
    SECRET: process.env.JWT_SECRET || 'your-secret-key',
    EXPIRY: process.env.JWT_EXPIRY || '7d',
};
exports.RATE_LIMIT_CONSTANTS = {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};
exports.CORS_CONSTANTS = {
    ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
exports.NLP_CONSTANTS = {
    MIN_SIMILARITY_THRESHOLD: 0.3,
    TOP_KEYWORDS: 20,
    MIN_TOKEN_LENGTH: 2,
};
exports.API_CONSTANTS = {
    API_PREFIX: '/api',
    VERSION: 'v1',
};
exports.ERROR_MESSAGES = {
    INVALID_FILE: 'Invalid file format. Only PDF and DOCX are allowed.',
    FILE_TOO_LARGE: 'File size exceeds maximum limit.',
    MISSING_FIELDS: 'Missing required fields.',
    UNAUTHORIZED: 'Unauthorized access.',
    NOT_FOUND: 'Resource not found.',
    INTERNAL_ERROR: 'Internal server error.',
    INVALID_INPUT: 'Invalid input provided.',
    DUPLICATE_ENTRY: 'Duplicate entry found.',
};
exports.SUCCESS_MESSAGES = {
    FILE_UPLOADED: 'File uploaded successfully.',
    ANALYSIS_COMPLETE: 'Analysis completed successfully.',
    COMPARISON_COMPLETE: 'Comparison completed successfully.',
};
//# sourceMappingURL=index.js.map