/**
 * Security Utility Class
 */
export declare class SecurityUtils {
    /**
     * Hash password with bcrypt
     */
    static hashPassword(password: string): Promise<string>;
    /**
     * Compare password with hash
     */
    static comparePassword(password: string, hash: string): Promise<boolean>;
    /**
     * Generate random token
     */
    static generateRandomToken(length?: number): string;
    /**
     * Sanitize user input
     */
    static sanitizeInput(input: string): string;
    /**
     * Validate email format
     */
    static isValidEmail(email: string): boolean;
}
//# sourceMappingURL=securityUtils.d.ts.map