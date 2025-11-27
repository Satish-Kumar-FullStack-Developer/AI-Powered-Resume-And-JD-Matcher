"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
const database_1 = __importDefault(require("./config/database"));
const index_1 = require("./constants/index");
const authMiddleware_1 = require("./middleware/authMiddleware");
const index_2 = __importDefault(require("./routes/index"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
/**
 * Middleware Setup
 */
// CORS Configuration
app.use((0, cors_1.default)({
    origin: index_1.CORS_CONSTANTS.ORIGIN,
    credentials: true,
}));
// Request body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: index_1.RATE_LIMIT_CONSTANTS.WINDOW_MS,
    max: index_1.RATE_LIMIT_CONSTANTS.MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);
/**
 * API Routes
 */
app.use('/api', index_2.default);
/**
 * Health Check Route
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});
/**
 * Error Handling
 */
app.use(authMiddleware_1.notFoundMiddleware);
app.use(authMiddleware_1.errorMiddleware);
/**
 * Server Initialization
 */
const startServer = async () => {
    try {
        // Connect to MongoDB
        await database_1.default.connect();
        // Start Express server
        app.listen(PORT, () => {
            logger_1.default.info(`Server running on port ${PORT}`);
            logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
// Handle graceful shutdown
process.on('SIGTERM', async () => {
    logger_1.default.info('SIGTERM signal received: closing HTTP server');
    await database_1.default.disconnect();
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.default.info('SIGINT signal received: closing HTTP server');
    await database_1.default.disconnect();
    process.exit(0);
});
// Start the server
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map