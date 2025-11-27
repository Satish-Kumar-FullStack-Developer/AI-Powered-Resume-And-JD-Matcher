import { Request, Response } from 'express';
import { MatchingService, AnalysisResult } from '../services/matchingService';
import { TextProcessingUtils } from '../utils/textProcessingUtils';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import fs from 'fs';
import path from 'path';

/**
 * Matching Controller
 * Handles resume and job description matching
 */
export class MatchingController {
  /**
   * Compare resume with job description
   */
  static async compareResumeWithJD(req: Request, res: Response): Promise<void> {
    let resumePath: string | null = null;
    let jdPath: string | null = null;

    try {
      const filesObj = req.files as any;
      const resume = filesObj?.resume ? (filesObj.resume as Express.Multer.File[])[0] : undefined;
      const jd = filesObj?.jobDescription ? (filesObj.jobDescription as Express.Multer.File[])[0] : undefined;

      if (!resume || !jd) {
        res.status(400).json(ApiResponse.error('Both resume and job description are required', 400));
        return;
      }

      resumePath = resume.path;
      jdPath = jd.path;

      // Extract text from files
      const resumeText = await MatchingController.extractText(resume);
      const jdText = await MatchingController.extractText(jd);

      logger.info('Extracted resume text length:', resumeText.length);
      logger.info('Extracted JD text length:', jdText.length);

      if (!resumeText || resumeText.trim().length === 0) {
        res.status(400).json(ApiResponse.error('Could not extract text from resume', 400));
        return;
      }

      if (!jdText || jdText.trim().length === 0) {
        res.status(400).json(ApiResponse.error('Could not extract text from job description', 400));
        return;
      }

      // Analyze match
      const analysisResult = await MatchingService.analyzeMatch(resumeText, jdText);

      logger.info('Comparison successful - Match:', analysisResult.matchPercentage);

      res.status(200).json(
        ApiResponse.success(
          {
            matchPercentage: analysisResult.matchPercentage,
            matchedKeywords: analysisResult.matchedKeywords,
            missingSkills: analysisResult.missingSkills,
            suggestions: analysisResult.suggestions,
          },
          'Comparison completed successfully'
        )
      );
    } catch (error) {
      logger.error('Comparison error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Comparison failed';
      res.status(500).json(ApiResponse.error(errorMessage, 500, error));
    } finally {
      // Clean up uploaded files
      if (resumePath && fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
      if (jdPath && fs.existsSync(jdPath)) {
        fs.unlinkSync(jdPath);
      }
    }
  }

  /**
   * Debug endpoint - Test text extraction
   */
  static async debugExtraction(req: Request, res: Response): Promise<void> {
    let resumePath: string | null = null;

    try {
      const filesObj = req.files as any;
      const resume = filesObj?.resume ? (filesObj.resume as Express.Multer.File[])[0] : undefined;

      if (!resume) {
        res.status(400).json(ApiResponse.error('Resume file is required', 400));
        return;
      }

      resumePath = resume.path;

      // Extract text
      const resumeText = await MatchingController.extractText(resume);

      logger.info('Debug - Extracted text length:', resumeText.length);
      logger.info('Debug - First 500 chars:', resumeText.substring(0, 500));

      // Extract keywords
      const keywords = Array.from(
        TextProcessingUtils.extractKeywords(resumeText).keys()
      );

      res.status(200).json(
        ApiResponse.success(
          {
            textLength: resumeText.length,
            keywordCount: keywords.length,
            keywords: keywords.slice(0, 50),
            extractedText: resumeText.substring(0, 1000),
          },
          'Debug extraction successful'
        )
      );
    } catch (error) {
      logger.error('Debug extraction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Debug extraction failed';
      res.status(500).json(ApiResponse.error(errorMessage, 500, error));
    } finally {
      if (resumePath && fs.existsSync(resumePath)) {
        fs.unlinkSync(resumePath);
      }
    }
  }

  /**
   * Get match history
   */
  static async getMatchHistory(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ApiResponse.error('Unauthorized', 401));
        return;
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const matchResults = await MatchingService.getUserMatchHistory(req.user.id, limit);

      res.status(200).json(
        ApiResponse.success(matchResults, 'Match history retrieved successfully')
      );
    } catch (error) {
      logger.error('Get history error:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve history', 500, error));
    }
  }

  /**
   * Extract text from uploaded file
   */
  private static async extractText(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === '.pdf') {
      return await TextProcessingUtils.extractTextFromPDF(file.path);
    }

    if (ext === '.docx') {
      // For DOCX, we would use a library like 'docx' or 'mammoth'
      // For now, returning a placeholder
      throw new Error('DOCX extraction not yet implemented. Please use PDF.');
    }

    if (ext === '.txt') {
      return fs.readFileSync(file.path, 'utf-8');
    }

    throw new Error('Unsupported file format');
  }
}
