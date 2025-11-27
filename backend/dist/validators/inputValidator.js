"use strict";
/**
 * Validators for API input
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidator = void 0;
class InputValidator {
    /**
     * Validate file upload request
     */
    static validateFileUpload(resume, jd) {
        if (!resume || !jd) {
            throw new Error('Both resume and job description files are required.');
        }
        if (!resume.originalname.match(/\.(pdf|docx)$/i)) {
            throw new Error('Resume must be PDF or DOCX format.');
        }
        if (!jd.originalname.match(/\.(pdf|docx|txt)$/i)) {
            throw new Error('Job description must be PDF, DOCX, or TXT format.');
        }
    }
    /**
     * Validate email
     */
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Validate password strength
     */
    static validatePassword(password) {
        const errors = [];
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter.');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter.');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least one digit.');
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('Password must contain at least one special character (!@#$%^&*).');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    /**
     * Validate user registration data
     */
    static validateUserRegistration(data) {
        const errors = [];
        if (!data.email) {
            errors.push('Email is required.');
        }
        else if (!this.validateEmail(data.email)) {
            errors.push('Invalid email format.');
        }
        if (!data.password) {
            errors.push('Password is required.');
        }
        else {
            const passwordValidation = this.validatePassword(data.password);
            if (!passwordValidation.isValid) {
                errors.push(...passwordValidation.errors);
            }
        }
        if (data.password !== data.confirmPassword) {
            errors.push('Passwords do not match.');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    /**
     * Sanitize text input
     */
    static sanitizeText(text) {
        return text
            .trim()
            .replace(/[<>]/g, '')
            .substring(0, 10000); // Limit to 10k characters
    }
}
exports.InputValidator = InputValidator;
//# sourceMappingURL=inputValidator.js.map