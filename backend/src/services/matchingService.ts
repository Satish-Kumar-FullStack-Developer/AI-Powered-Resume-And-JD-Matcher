import { TextProcessingUtils } from '../utils/textProcessingUtils';
import MatchResult, { IMatchResult } from '../models/MatchResult';
import logger from '../config/logger';
import mongoose from 'mongoose';

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
export class MatchingService {
  /**
   * Analyze resume and job description
   */
  static async analyzeMatch(
    resumeText: string,
    jdText: string
  ): Promise<AnalysisResult> {
    try {
      logger.info('Analyzing match with resume length:', resumeText.length, 'JD length:', jdText.length);

      // Extract keywords with extended limit for better matching
      const resumeKeywords = Array.from(
        TextProcessingUtils.extractKeywords(resumeText).keys()
      );
      const jdKeywords = Array.from(
        TextProcessingUtils.extractKeywords(jdText).keys()
      );

      logger.info('Resume keywords count:', resumeKeywords.length, 'JD keywords count:', jdKeywords.length);

      // Calculate similarity using multiple approaches
      const jaccardSimilarity = TextProcessingUtils.calculateSimilarity(resumeText, jdText);

      // Find matched keywords
      const matchedKeywords = resumeKeywords.filter((keyword) =>
        jdKeywords.includes(keyword)
      );

      // Find missing skills
      const missingSkills = TextProcessingUtils.findMissingSkills(
        resumeKeywords,
        jdKeywords
      );

      logger.info('Matched keywords:', matchedKeywords.length, 'Missing skills:', missingSkills.length);

      // Generate suggestions
      const suggestions = this.generateSuggestions(
        matchedKeywords,
        missingSkills,
        jaccardSimilarity
      );

      // Calculate match percentage using multiple factors:
      // 1. Matched keywords ratio (how many JD keywords are in resume)
      // 2. Jaccard similarity (overall text overlap)
      // 3. Keyword frequency analysis
      
      const keywordRatio = jdKeywords.length > 0 
        ? (matchedKeywords.length / jdKeywords.length) * 100 
        : 0;
      
      const similarityPercent = jaccardSimilarity * 100;

      // For better matching, analyze if key technical terms appear
      const technicalTerms = ['react', 'nodejs', 'javascript', 'typescript', 'mongodb', 'postgresql', 'docker', 'aws', 'express', 'html', 'css'];
      const resumeTech = resumeText.toLowerCase();
      const jdTech = jdText.toLowerCase();
      
      const technicalMatches = technicalTerms.filter(term => 
        resumeTech.includes(term) && jdTech.includes(term)
      ).length;
      
      const technicalScore = (technicalMatches / technicalTerms.length) * 100;

      // Weighted average: 40% keyword matching, 40% overall similarity, 20% technical terms
      const matchPercentage = Math.round(
        (keywordRatio * 0.4 + similarityPercent * 0.4 + technicalScore * 0.2)
      );

      logger.info('Match calculation:', {
        keywordRatio: keywordRatio.toFixed(2),
        similarityPercent: similarityPercent.toFixed(2),
        technicalScore: technicalScore.toFixed(2),
        finalPercentage: matchPercentage
      });

      return {
        matchPercentage: Math.min(100, Math.max(0, matchPercentage)),
        matchedKeywords: matchedKeywords.slice(0, 20),
        missingSkills: missingSkills.slice(0, 20),
        suggestions,
        resumeKeywords,
        jdKeywords,
      };
    } catch (error) {
      logger.error('Analysis error:', error);
      throw error;
    }
  }

  /**
   * Save match result
   */
  static async saveMatchResult(
    userId: string,
    resumeFileName: string,
    jdFileName: string,
    analysisResult: AnalysisResult
  ): Promise<IMatchResult> {
    try {
      const matchResult = new MatchResult({
        userId: new mongoose.Types.ObjectId(userId),
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

      logger.info('Match result saved:', matchResult._id);
      return matchResult;
    } catch (error) {
      logger.error('Save match result error:', error);
      throw error;
    }
  }

  /**
   * Get match history for user
   */
  static async getUserMatchHistory(userId: string, limit: number = 10): Promise<IMatchResult[]> {
    try {
      const results = await MatchResult.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);

      return results;
    } catch (error) {
      logger.error('Get match history error:', error);
      throw error;
    }
  }

  /**
   * Generate AI suggestions
   */
  private static generateSuggestions(
    matchedKeywords: string[],
    missingSkills: string[],
    similarity: number
  ): string[] {
    const suggestions: string[] = [];
    const matchPercentage = matchedKeywords.length > 0
      ? (matchedKeywords.length / (matchedKeywords.length + missingSkills.length)) * 100
      : 0;

    // Match quality suggestions
    if (matchPercentage > 80) {
      suggestions.push('✓ Excellent match! Your resume aligns well with the job description.');
    } else if (matchPercentage > 60) {
      suggestions.push(
        '✓ Good match! Consider highlighting your relevant experience more prominently.'
      );
    } else if (matchPercentage > 40) {
      suggestions.push('⚠ Moderate match. Consider developing the missing skills listed below.');
    } else {
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
      suggestions.push(
        '🎯 Your experience domain differs from the role. Consider tailoring your resume for this specific position.'
      );
    }

    return suggestions;
  }
}
