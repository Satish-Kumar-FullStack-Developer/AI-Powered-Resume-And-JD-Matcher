"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const inputValidator_1 = require("../validators/inputValidator");
const apiResponse_1 = require("../utils/apiResponse");
const logger_1 = __importDefault(require("../config/logger"));
/**
 * Authentication Controller
 */
class AuthController {
    /**
     * Register endpoint
     */
    static async register(req, res) {
        try {
            const { email, password, confirmPassword, firstName, lastName } = req.body;
            // Validate input
            const validation = inputValidator_1.InputValidator.validateUserRegistration({
                email,
                password,
                confirmPassword,
            });
            if (!validation.isValid) {
                res.status(400).json(apiResponse_1.ApiResponse.error('Validation failed', 400, validation.errors));
                return;
            }
            // Register user
            const user = await authService_1.AuthService.registerUser({
                email,
                password,
                firstName: inputValidator_1.InputValidator.sanitizeText(firstName),
                lastName: inputValidator_1.InputValidator.sanitizeText(lastName),
            });
            // Generate token
            const token = authService_1.AuthService.generateToken(user);
            res.status(201).json(apiResponse_1.ApiResponse.success({ user: { id: user._id, email: user.email, firstName, lastName }, token }, 'User registered successfully', 201));
        }
        catch (error) {
            logger_1.default.error('Register error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            res.status(400).json(apiResponse_1.ApiResponse.error(errorMessage, 400, error));
        }
    }
    /**
     * Login endpoint
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json(apiResponse_1.ApiResponse.error('Email and password are required', 400));
                return;
            }
            const { user, token } = await authService_1.AuthService.loginUser(email, password);
            res.status(200).json(apiResponse_1.ApiResponse.success({ user: { id: user._id, email: user.email }, token }, 'Login successful'));
        }
        catch (error) {
            logger_1.default.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            res.status(401).json(apiResponse_1.ApiResponse.error(errorMessage, 401));
        }
    }
    /**
     * Get current user
     */
    static async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                res.status(401).json(apiResponse_1.ApiResponse.error('Unauthorized', 401));
                return;
            }
            const user = await authService_1.AuthService.getUserById(req.user.id);
            if (!user) {
                res.status(404).json(apiResponse_1.ApiResponse.error('User not found', 404));
                return;
            }
            res.status(200).json(apiResponse_1.ApiResponse.success(user, 'User retrieved successfully'));
        }
        catch (error) {
            logger_1.default.error('Get user error:', error);
            res.status(500).json(apiResponse_1.ApiResponse.error('Failed to retrieve user', 500, error));
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map