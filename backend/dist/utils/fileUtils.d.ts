/**
 * Utility class for file operations
 */
export declare class FileUtils {
    /**
     * Generate unique filename
     */
    static generateFileName(originalName: string): string;
    /**
     * Get file extension
     */
    static getFileExtension(filename: string): string;
    /**
     * Validate file extension
     */
    static isValidExtension(filename: string, allowedExtensions: string[]): boolean;
    /**
     * Format file size
     */
    static formatFileSize(bytes: number): string;
}
//# sourceMappingURL=fileUtils.d.ts.map