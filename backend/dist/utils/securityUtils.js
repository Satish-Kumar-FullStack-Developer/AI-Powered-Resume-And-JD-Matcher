"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityUtils = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Security Utility Class
 */
class SecurityUtils {
    /**
     * Hash password with bcrypt
     */
    static async hashPassword(password) {
        const saltRounds = 10;
        return bcryptjs_1.default.hash(password, saltRounds);
    }
    /**
     * Compare password with hash
     */
    static async comparePassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    }
    /**
     * Generate random token
     */
    static generateRandomToken(length = 32) {
        const crypto = require('crypto');
        return crypto.randomBytes(length).toString('hex');
    }
    /**
     * Sanitize user input
     */
    static sanitizeInput(input) {
        return input
            .trim()
            .replace(/[<>]/g, '')
            .replace(/[&]/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    /**
     * Validate email format
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
exports.SecurityUtils = SecurityUtils;
//# sourceMappingURL=securityUtils.js.map