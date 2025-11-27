/**
 * Text Processing and NLP Utility Class
 */
export declare class TextProcessingUtils {
    /**
     * Extract text from PDF
     */
    static extractTextFromPDF(filePath: string): Promise<string>;
    /**
     * Tokenize text
     */
    static tokenizeText(text: string): string[];
    /**
     * Extract keywords from text
     */
    static extractKeywords(text: string): Map<string, number>;
    /**
     * Calculate TF-IDF score
     */
    static calculateTFIDF(tokens: string[], allDocuments: string[][]): Map<string, number>;
    /**
     * Calculate similarity between two text documents
     */
    static calculateSimilarity(text1: string, text2: string): number;
    /**
     * Find missing skills
     */
    static findMissingSkills(resumeKeywords: string[], jdKeywords: string[]): string[];
    /**
     * Common English stopwords
     */
    private static isStopword;
}
//# sourceMappingURL=textProcessingUtils.d.ts.map