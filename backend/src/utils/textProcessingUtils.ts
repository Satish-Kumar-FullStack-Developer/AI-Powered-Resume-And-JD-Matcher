import * as pdfjs from 'pdfjs-dist';
import * as fs from 'fs';
import { NLP_CONSTANTS } from '../constants/index';

/**
 * Text Processing and NLP Utility Class
 */
export class TextProcessingUtils {
  /**
   * Extract text from PDF
   */
  static async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      // Read PDF file and convert to Uint8Array
      const pdfBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(pdfBuffer);
      
      const pdf = await pdfjs.getDocument(uint8Array).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .join(' ');
          fullText += pageText + ' ';
        } catch (pageError) {
          console.error(`Error extracting page ${pageNum}:`, pageError);
          continue;
        }
      }

      if (!fullText || fullText.trim().length === 0) {
        throw new Error('No text extracted from PDF');
      }

      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Tokenize text
   */
  static tokenizeText(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(
        (token) =>
          token.length >= NLP_CONSTANTS.MIN_TOKEN_LENGTH && !this.isStopword(token)
      );
  }

  /**
   * Extract keywords from text
   */
  static extractKeywords(text: string): Map<string, number> {
    const tokens = this.tokenizeText(text);
    const keywords = new Map<string, number>();

    tokens.forEach((token) => {
      keywords.set(token, (keywords.get(token) || 0) + 1);
    });

    // Sort by frequency and get top keywords
    const sorted = Array.from(keywords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, NLP_CONSTANTS.TOP_KEYWORDS);

    return new Map(sorted);
  }

  /**
   * Calculate TF-IDF score
   */
  static calculateTFIDF(
    tokens: string[],
    allDocuments: string[][]
  ): Map<string, number> {
    const tfidf = new Map<string, number>();
    const docCount = allDocuments.length;
    const tf = new Map<string, number>();

    // Calculate TF (Term Frequency)
    tokens.forEach((token) => {
      tf.set(token, (tf.get(token) || 0) + 1);
    });

    // Calculate IDF and TFIDF
    tf.forEach((termFreq, term) => {
      const docsWithTerm = allDocuments.filter((doc) =>
        doc.includes(term)
      ).length;
      const idf = Math.log(docCount / (1 + docsWithTerm));
      const tfidfScore = (termFreq / tokens.length) * idf;
      tfidf.set(term, tfidfScore);
    });

    return tfidf;
  }

  /**
   * Calculate similarity between two text documents
   */
  static calculateSimilarity(text1: string, text2: string): number {
    const tokens1 = this.tokenizeText(text1);
    const tokens2 = this.tokenizeText(text2);

    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);

    const intersection = new Set(
      Array.from(set1).filter((x) => set2.has(x))
    );
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Find missing skills
   */
  static findMissingSkills(resumeKeywords: string[], jdKeywords: string[]): string[] {
    const resumeSet = new Set(resumeKeywords);
    return jdKeywords.filter((skill) => !resumeSet.has(skill));
  }

  /**
   * Common English stopwords
   */
  private static isStopword(word: string): boolean {
    const stopwords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
      'the', 'to', 'was', 'will', 'with', 'this', 'you', 'your',
      'we', 'they', 'them', 'these', 'those', 'have', 'do', 'does',
      'did', 'been', 'being', 'very', 'which', 'who', 'when', 'where',
    ]);
    return stopwords.has(word);
  }
}
