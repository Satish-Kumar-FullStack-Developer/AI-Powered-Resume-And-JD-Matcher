"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Utility class for file operations
 */
class FileUtils {
    /**
     * Generate unique filename
     */
    static generateFileName(originalName) {
        const timestamp = Date.now();
        const randomString = crypto_1.default.randomBytes(8).toString('hex');
        const extension = originalName.split('.').pop();
        return `${timestamp}-${randomString}.${extension}`;
    }
    /**
     * Get file extension
     */
    static getFileExtension(filename) {
        return filename.split('.').pop()?.toLowerCase() || '';
    }
    /**
     * Validate file extension
     */
    static isValidExtension(filename, allowedExtensions) {
        const ext = this.getFileExtension(filename);
        return allowedExtensions.includes(ext);
    }
    /**
     * Format file size
     */
    static formatFileSize(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=fileUtils.js.map