"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const index_1 = require("../constants/index");
const fileUtils_1 = require("../utils/fileUtils");
const logger_1 = __importDefault(require("../config/logger"));
/**
 * Multer File Upload Middleware Configuration
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, index_1.FILE_CONSTANTS.UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = fileUtils_1.FileUtils.generateFileName(file.originalname);
        cb(null, uniqueName);
    },
});
/**
 * File filter for allowed extensions
 */
const fileFilter = (req, file, cb) => {
    if (!fileUtils_1.FileUtils.isValidExtension(file.originalname, index_1.FILE_CONSTANTS.ALLOWED_EXTENSIONS)) {
        logger_1.default.warn('Invalid file type attempted:', file.originalname);
        cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
        return;
    }
    if (file.size > index_1.FILE_CONSTANTS.MAX_FILE_SIZE) {
        logger_1.default.warn('File size exceeded:', file.filename);
        cb(new Error('File size exceeds maximum limit.'));
        return;
    }
    cb(null, true);
};
/**
 * Create multer upload instance
 */
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: index_1.FILE_CONSTANTS.MAX_FILE_SIZE,
    },
});
/**
 * Custom error handler for multer
 */
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        logger_1.default.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                success: false,
                message: 'File size exceeds maximum limit.',
            });
            return;
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            res.status(400).json({
                success: false,
                message: 'Too many files.',
            });
            return;
        }
    }
    if (err) {
        logger_1.default.error('Upload error:', err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }
    next();
};
exports.handleMulterError = handleMulterError;
//# sourceMappingURL=uploadMiddleware.js.map