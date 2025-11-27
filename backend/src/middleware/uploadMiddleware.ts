import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { FILE_CONSTANTS } from '../constants/index';
import { FileUtils } from '../utils/fileUtils';
import logger from '../config/logger';

/**
 * Multer File Upload Middleware Configuration
 */
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, FILE_CONSTANTS.UPLOAD_DIR);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueName = FileUtils.generateFileName(file.originalname);
    cb(null, uniqueName);
  },
});

/**
 * File filter for allowed extensions
 */
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!FileUtils.isValidExtension(file.originalname, FILE_CONSTANTS.ALLOWED_EXTENSIONS)) {
    logger.warn('Invalid file type attempted:', file.originalname);
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
    return;
  }

  if (file.size > FILE_CONSTANTS.MAX_FILE_SIZE) {
    logger.warn('File size exceeded:', file.filename);
    cb(new Error('File size exceeds maximum limit.'));
    return;
  }

  cb(null, true);
};

/**
 * Create multer upload instance
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_CONSTANTS.MAX_FILE_SIZE,
  },
});

/**
 * Custom error handler for multer
 */
export const handleMulterError = (
  err: Error | null,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer error:', err);

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
    logger.error('Upload error:', err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  next();
};
