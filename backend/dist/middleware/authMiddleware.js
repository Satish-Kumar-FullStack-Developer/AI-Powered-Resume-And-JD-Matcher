"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = exports.errorMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../constants/index");
const logger_1 = __importDefault(require("../config/logger"));
/**
 * JWT Authentication Middleware
 */
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided',
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, index_1.JWT_CONSTANTS.SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
    logger_1.default.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'production' ? undefined : err,
    });
};
exports.errorMiddleware = errorMiddleware;
/**
 * Not Found Middleware
 */
const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.path} not found`,
    });
};
exports.notFoundMiddleware = notFoundMiddleware;
//# sourceMappingURL=authMiddleware.js.map