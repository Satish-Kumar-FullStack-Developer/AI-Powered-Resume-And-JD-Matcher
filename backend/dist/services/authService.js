"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../constants/index");
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../config/logger"));
/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */
class AuthService {
    /**
     * Register new user
     */
    static async registerUser(userData) {
        try {
            // Check if user already exists
            const existingUser = await User_1.default.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already registered with this email.');
            }
            // Create new user
            const user = new User_1.default(userData);
            await user.save();
            logger_1.default.info('User registered successfully:', userData.email);
            return user;
        }
        catch (error) {
            logger_1.default.error('Registration error:', error);
            throw error;
        }
    }
    /**
     * Login user
     */
    static async loginUser(email, password) {
        try {
            const user = await User_1.default.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Invalid email or password.');
            }
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password.');
            }
            const token = this.generateToken(user);
            logger_1.default.info('User logged in successfully:', email);
            return { user, token };
        }
        catch (error) {
            logger_1.default.error('Login error:', error);
            throw error;
        }
    }
    /**
     * Generate JWT token
     */
    static generateToken(user) {
        return jsonwebtoken_1.default.sign({
            id: user._id,
            email: user.email,
        }, index_1.JWT_CONSTANTS.SECRET, {
            expiresIn: index_1.JWT_CONSTANTS.EXPIRY,
        });
    }
    /**
     * Verify JWT token
     */
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, index_1.JWT_CONSTANTS.SECRET);
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    /**
     * Get user by ID
     */
    static async getUserById(userId) {
        try {
            const user = await User_1.default.findById(userId);
            return user;
        }
        catch (error) {
            logger_1.default.error('Get user error:', error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map