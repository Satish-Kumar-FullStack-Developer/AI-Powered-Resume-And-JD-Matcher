"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextProcessingUtils = void 0;
const pdfjs = __importStar(require("pdfjs-dist"));
const index_1 = require("../constants/index");
/**
 * Text Processing and NLP Utility Class
 */
class TextProcessingUtils {
    /**
     * Extract text from PDF
     */
    static async extractTextFromPDF(filePath) {
        try {
            const pdf = await pdfjs.getDocument(filePath).promise;
            let fullText = '';
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item) => item.str)
                    .join(' ');
                fullText += pageText + ' ';
            }
            return fullText;
        }
        catch (error) {
            throw new Error('Failed to extract text from PDF');
        }
    }
    /**
     * Tokenize text
     */
    static tokenizeText(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((token) => token.length >= index_1.NLP_CONSTANTS.MIN_TOKEN_LENGTH && !this.isStopword(token));
    }
    /**
     * Extract keywords from text
     */
    static extractKeywords(text) {
        const tokens = this.tokenizeText(text);
        const keywords = new Map();
        tokens.forEach((token) => {
            keywords.set(token, (keywords.get(token) || 0) + 1);
        });
        // Sort by frequency and get top keywords
        const sorted = Array.from(keywords.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, index_1.NLP_CONSTANTS.TOP_KEYWORDS);
        return new Map(sorted);
    }
    /**
     * Calculate TF-IDF score
     */
    static calculateTFIDF(tokens, allDocuments) {
        const tfidf = new Map();
        const docCount = allDocuments.length;
        const tf = new Map();
        // Calculate TF (Term Frequency)
        tokens.forEach((token) => {
            tf.set(token, (tf.get(token) || 0) + 1);
        });
        // Calculate IDF and TFIDF
        tf.forEach((termFreq, term) => {
            const docsWithTerm = allDocuments.filter((doc) => doc.includes(term)).length;
            const idf = Math.log(docCount / (1 + docsWithTerm));
            const tfidfScore = (termFreq / tokens.length) * idf;
            tfidf.set(term, tfidfScore);
        });
        return tfidf;
    }
    /**
     * Calculate similarity between two text documents
     */
    static calculateSimilarity(text1, text2) {
        const tokens1 = this.tokenizeText(text1);
        const tokens2 = this.tokenizeText(text2);
        const set1 = new Set(tokens1);
        const set2 = new Set(tokens2);
        const intersection = new Set(Array.from(set1).filter((x) => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        return intersection.size / union.size;
    }
    /**
     * Find missing skills
     */
    static findMissingSkills(resumeKeywords, jdKeywords) {
        const resumeSet = new Set(resumeKeywords);
        return jdKeywords.filter((skill) => !resumeSet.has(skill));
    }
    /**
     * Common English stopwords
     */
    static isStopword(word) {
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
exports.TextProcessingUtils = TextProcessingUtils;
//# sourceMappingURL=textProcessingUtils.js.map