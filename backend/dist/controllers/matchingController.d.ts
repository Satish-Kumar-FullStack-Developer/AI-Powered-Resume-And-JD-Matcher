import { Request, Response } from 'express';
/**
 * Matching Controller
 * Handles resume and job description matching
 */
export declare class MatchingController {
    /**
     * Compare resume with job description
     */
    static compareResumeWithJD(req: Request, res: Response): Promise<void>;
    /**
     * Get match history
     */
    static getMatchHistory(req: Request, res: Response): Promise<void>;
    /**
     * Extract text from uploaded file
     */
    private static extractText;
}
//# sourceMappingURL=matchingController.d.ts.map