"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchingController = void 0;
const matchingService_1 = require("../services/matchingService");
const textProcessingUtils_1 = require("../utils/textProcessingUtils");
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = __importDefault(require("../config/logger"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Matching Controller
 * Handles resume and job description matching
 */
class MatchingController {
    /**
     * Compare resume with job description
     */
    static async compareResumeWithJD(req, res) {
        let resumePath = null;
        let jdPath = null;
        try {
            if (!req.user) {
                res.status(401).json(apiResponse_1.ApiResponse.error('Unauthorized', 401));
                return;
            }
            const filesObj = req.files;
            const resume = filesObj?.resume ? filesObj.resume[0] : undefined;
            const jd = filesObj?.jd ? filesObj.jd[0] : undefined;
            if (!resume || !jd) {
                res.status(400).json(apiResponse_1.ApiResponse.error('Both resume and job description are required', 400));
                return;
            }
            resumePath = resume.path;
            jdPath = jd.path;
            // Extract text from files
            const resumeText = await this.extractText(resume);
            const jdText = await this.extractText(jd);
            // Analyze match
            const analysisResult = await matchingService_1.MatchingService.analyzeMatch(resumeText, jdText);
            // Save result
            const matchResult = await matchingService_1.MatchingService.saveMatchResult(req.user.id, resume.filename, jd.filename, analysisResult);
            logger_1.default.info('Comparison successful for user:', req.user.id);
            res.status(200).json(apiResponse_1.ApiResponse.success({
                matchPercentage: analysisResult.matchPercentage,
                matchedKeywords: analysisResult.matchedKeywords,
                missingSkills: analysisResult.missingSkills,
                suggestions: analysisResult.suggestions,
                resultId: matchResult._id,
            }, 'Comparison completed successfully'));
        }
        catch (error) {
            logger_1.default.error('Comparison error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Comparison failed';
            res.status(500).json(apiResponse_1.ApiResponse.error(errorMessage, 500, error));
        }
        finally {
            // Clean up uploaded files
            if (resumePath && fs_1.default.existsSync(resumePath)) {
                fs_1.default.unlinkSync(resumePath);
            }
            if (jdPath && fs_1.default.existsSync(jdPath)) {
                fs_1.default.unlinkSync(jdPath);
            }
        }
    }
    /**
     * Get match history
     */
    static async getMatchHistory(req, res) {
        try {
            if (!req.user) {
                res.status(401).json(apiResponse_1.ApiResponse.error('Unauthorized', 401));
                return;
            }
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
            const matchResults = await matchingService_1.MatchingService.getUserMatchHistory(req.user.id, limit);
            res.status(200).json(apiResponse_1.ApiResponse.success(matchResults, 'Match history retrieved successfully'));
        }
        catch (error) {
            logger_1.default.error('Get history error:', error);
            res.status(500).json(apiResponse_1.ApiResponse.error('Failed to retrieve history', 500, error));
        }
    }
    /**
     * Extract text from uploaded file
     */
    static async extractText(file) {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (ext === '.pdf') {
            return textProcessingUtils_1.TextProcessingUtils.extractTextFromPDF(file.path);
        }
        if (ext === '.docx') {
            // For DOCX, we would use a library like 'docx' or 'mammoth'
            // For now, returning a placeholder
            throw new Error('DOCX extraction not yet implemented. Please use PDF.');
        }
        if (ext === '.txt') {
            return fs_1.default.readFileSync(file.path, 'utf-8');
        }
        throw new Error('Unsupported file format');
    }
}
exports.MatchingController = MatchingController;
//# sourceMappingURL=matchingController.js.map