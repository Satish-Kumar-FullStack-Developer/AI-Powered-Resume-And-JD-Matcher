import { IMatchResult } from '../models/MatchResult';
export interface AnalysisResult {
    matchPercentage: number;
    matchedKeywords: string[];
    missingSkills: string[];
    suggestions: string[];
    resumeKeywords: string[];
    jdKeywords: string[];
}
/**
 * Resume Matching Service
 * Handles resume analysis and comparison logic
 */
export declare class MatchingService {
    /**
     * Analyze resume and job description
     */
    static analyzeMatch(resumeText: string, jdText: string): Promise<AnalysisResult>;
    /**
     * Save match result
     */
    static saveMatchResult(userId: string, resumeFileName: string, jdFileName: string, analysisResult: AnalysisResult): Promise<IMatchResult>;
    /**
     * Get match history for user
     */
    static getUserMatchHistory(userId: string, limit?: number): Promise<IMatchResult[]>;
    /**
     * Generate AI suggestions
     */
    private static generateSuggestions;
}
//# sourceMappingURL=matchingService.d.ts.map