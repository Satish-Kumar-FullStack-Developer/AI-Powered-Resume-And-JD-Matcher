"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const mongooseConnection = {
    connect: async () => {
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/resume-matcher';
            await mongoose_1.default.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000,
            });
            logger_1.default.info('MongoDB connected successfully');
        }
        catch (error) {
            logger_1.default.warn('MongoDB connection failed:', error);
            logger_1.default.warn('Server will start but database features may be unavailable');
            // Don't exit - allow server to start in degraded mode
        }
    },
    disconnect: async () => {
        try {
            await mongoose_1.default.disconnect();
            logger_1.default.info('MongoDB disconnected successfully');
        }
        catch (error) {
            logger_1.default.error('MongoDB disconnection failed:', error);
            throw error;
        }
    },
};
exports.default = mongooseConnection;
//# sourceMappingURL=database.js.map