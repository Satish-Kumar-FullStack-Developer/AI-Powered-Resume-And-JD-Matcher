import { IUser } from '../models/User';
/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */
export declare class AuthService {
    /**
     * Register new user
     */
    static registerUser(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<IUser>;
    /**
     * Login user
     */
    static loginUser(email: string, password: string): Promise<{
        user: IUser;
        token: string;
    }>;
    /**
     * Generate JWT token
     */
    static generateToken(user: IUser): string;
    /**
     * Verify JWT token
     */
    static verifyToken(token: string): {
        id: string;
        email: string;
    };
    /**
     * Get user by ID
     */
    static getUserById(userId: string): Promise<IUser | null>;
}
//# sourceMappingURL=authService.d.ts.map