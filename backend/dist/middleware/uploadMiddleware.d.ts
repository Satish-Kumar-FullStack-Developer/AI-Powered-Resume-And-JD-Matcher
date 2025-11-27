import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
/**
 * Create multer upload instance
 */
export declare const upload: multer.Multer;
/**
 * Custom error handler for multer
 */
export declare const handleMulterError: (err: Error | null, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=uploadMiddleware.d.ts.map