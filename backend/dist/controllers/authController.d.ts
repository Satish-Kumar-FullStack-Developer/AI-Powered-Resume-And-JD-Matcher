import { Request, Response } from 'express';
/**
 * Authentication Controller
 */
export declare class AuthController {
    /**
     * Register endpoint
     */
    static register(req: Request, res: Response): Promise<void>;
    /**
     * Login endpoint
     */
    static login(req: Request, res: Response): Promise<void>;
    /**
     * Get current user
     */
    static getCurrentUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map