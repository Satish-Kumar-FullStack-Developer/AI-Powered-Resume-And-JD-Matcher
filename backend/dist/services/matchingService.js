"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingService = void 0;
const textProcessingUtils_1 = require("../utils/textProcessingUtils");
const MatchResult_1 = __importDefault(require("../models/MatchResult"));
const logger_1 = __importDefault(require("../config/logger"));
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Resume Matching Service
 * Handles resume analysis and comparison logic
 */
class MatchingService {
    /**
     * Analyze resume and job description
     */
    static async analyzeMatch(resumeText, jdText) {
        try {
            // Extract keywords
            const resumeKeywords = Array.from(textProcessingUtils_1.TextProcessingUtils.extractKeywords(resumeText).keys());
            const jdKeywords = Array.from(textProcessingUtils_1.TextProcessingUtils.extractKeywords(jdText).keys());
            // Calculate similarity
            const similarity = textProcessingUtils_1.TextProcessingUtils.calculateSimilarity(resumeText, jdText);
            // Find matched keywords
            const matchedKeywords = resumeKeywords.filter((keyword) => jdKeywords.includes(keyword));
            // Find missing skills
            const missingSkills = textProcessingUtils_1.TextProcessingUtils.findMissingSkills(resumeKeywords, jdKeywords);
            // Generate suggestions
            const suggestions = this.generateSuggestions(matchedKeywords, missingSkills, similarity);
            // Calculate match percentage
            const matchPercentage = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
            logger_1.default.info('Analysis completed', {
                matchPercentage,
                matchedCount: matchedKeywords.length,
                missingCount: missingSkills.length,
            });
            return {
                matchPercentage,
                matchedKeywords,
                missingSkills,
                suggestions,
                resumeKeywords,
                jdKeywords,
            };
        }
        catch (error) {
            logger_1.default.error('Analysis error:', error);
            throw error;
        }
    }
    /**
     * Save match result
     */
    static async saveMatchResult(userId, resumeFileName, jdFileName, analysisResult) {
        try {
            const matchResult = new MatchResult_1.default({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                resumeFileName,
                jdFileName,
                matchPercentage: analysisResult.matchPercentage,
                matchDetails: {
                    resumeKeywords: analysisResult.resumeKeywords,
                    jdKeywords: analysisResult.jdKeywords,
                    matchedKeywords: analysisResult.matchedKeywords,
                    missingSkills: analysisResult.missingSkills,
                },
                suggestions: analysisResult.suggestions,
            });
            await matchResult.save();
            logger_1.default.info('Match result saved:', matchResult._id);
            return matchResult;
        }
        catch (error) {
            logger_1.default.error('Save match result error:', error);
            throw error;
        }
    }
    /**
     * Get match history for user
     */
    static async getUserMatchHistory(userId, limit = 10) {
        try {
            const results = await MatchResult_1.default.find({ userId })
                .sort({ createdAt: -1 })
                .limit(limit);
            return results;
        }
        catch (error) {
            logger_1.default.error('Get match history error:', error);
            throw error;
        }
    }
    /**
     * Generate AI suggestions
     */
    static generateSuggestions(matchedKeywords, missingSkills, similarity) {
        const suggestions = [];
        const matchPercentage = matchedKeywords.length > 0
            ? (matchedKeywords.length / (matchedKeywords.length + missingSkills.length)) * 100
            : 0;
        // Match quality suggestions
        if (matchPercentage > 80) {
            suggestions.push('✓ Excellent match! Your resume aligns well with the job description.');
        }
        else if (matchPercentage > 60) {
            suggestions.push('✓ Good match! Consider highlighting your relevant experience more prominently.');
        }
        else if (matchPercentage > 40) {
            suggestions.push('⚠ Moderate match. Consider developing the missing skills listed below.');
        }
        else {
            suggestions.push('⚠ Low match. Focus on acquiring the key skills mentioned in the job description.');
        }
        // Missing skills suggestions
        if (missingSkills.length > 0) {
            const topMissing = missingSkills.slice(0, 5).join(', ');
            suggestions.push(`📚 Consider acquiring these key skills: ${topMissing}`);
        }
        // Format and presentation
        if (matchedKeywords.length < 5) {
            suggestions.push('📝 Add more technical details and relevant keywords to your resume.');
        }
        // Experience
        if (similarity < 0.3) {
            suggestions.push('🎯 Your experience domain differs from the role. Consider tailoring your resume for this specific position.');
        }
        return suggestions;
    }
}
exports.MatchingService = MatchingService;
//# sourceMappingURL=matchingService.js.map