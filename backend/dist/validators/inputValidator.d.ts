/**
 * Validators for API input
 */
export declare class InputValidator {
    /**
     * Validate file upload request
     */
    static validateFileUpload(resume: Express.Multer.File | undefined, jd: Express.Multer.File | undefined): void;
    /**
     * Validate email
     */
    static validateEmail(email: string): boolean;
    /**
     * Validate password strength
     */
    static validatePassword(password: string): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Validate user registration data
     */
    static validateUserRegistration(data: {
        email?: string;
        password?: string;
        confirmPassword?: string;
    }): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Sanitize text input
     */
    static sanitizeText(text: string): string;
}
//# sourceMappingURL=inputValidator.d.ts.map