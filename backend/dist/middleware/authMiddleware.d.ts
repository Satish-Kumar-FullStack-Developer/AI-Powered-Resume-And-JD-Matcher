import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}
/**
 * JWT Authentication Middleware
 */
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Error Handling Middleware
 */
export declare const errorMiddleware: (err: Error | any, req: Request, res: Response, next: NextFunction) => void;
/**
 * Not Found Middleware
 */
export declare const notFoundMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map