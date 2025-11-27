import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { InputValidator } from '../validators/inputValidator';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';

/**
 * Authentication Controller
 */
export class AuthController {
  /**
   * Register endpoint
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, confirmPassword, firstName, lastName } = req.body;

      // Validate input
      const validation = InputValidator.validateUserRegistration({
        email,
        password,
        confirmPassword,
      });

      if (!validation.isValid) {
        res.status(400).json(
          ApiResponse.error(
            'Validation failed',
            400,
            validation.errors
          )
        );
        return;
      }

      // Register user
      const user = await AuthService.registerUser({
        email,
        password,
        firstName: InputValidator.sanitizeText(firstName),
        lastName: InputValidator.sanitizeText(lastName),
      });

      // Generate token
      const token = AuthService.generateToken(user);

      res.status(201).json(
        ApiResponse.success(
          { user: { id: user._id, email: user.email, firstName, lastName }, token },
          'User registered successfully',
          201
        )
      );
    } catch (error) {
      logger.error('Register error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json(ApiResponse.error(errorMessage, 400, error));
    }
  }

  /**
   * Login endpoint
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json(ApiResponse.error('Email and password are required', 400));
        return;
      }

      const { user, token } = await AuthService.loginUser(email, password);

      res.status(200).json(
        ApiResponse.success(
          { user: { id: user._id, email: user.email }, token },
          'Login successful'
        )
      );
    } catch (error) {
      logger.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json(ApiResponse.error(errorMessage, 401));
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json(ApiResponse.error('Unauthorized', 401));
        return;
      }

      const user = await AuthService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json(ApiResponse.error('User not found', 404));
        return;
      }

      res.status(200).json(ApiResponse.success(user, 'User retrieved successfully'));
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json(ApiResponse.error('Failed to retrieve user', 500, error));
    }
  }

  /**
   * Forgot password endpoint
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json(ApiResponse.error('Email is required', 400));
        return;
      }

      const { token } = await AuthService.requestPasswordReset(email);
      
      logger.info('Password reset token generated for email:', email);
      logger.info('Token (first 20 chars):', token.substring(0, 20) + '...');

      res.status(200).json(
        ApiResponse.success(
          { token, message: 'Reset token sent to your email' },
          'Password reset email sent successfully'
        )
      );
    } catch (error) {
      logger.error('Forgot password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to request password reset';
      res.status(400).json(ApiResponse.error(errorMessage, 400));
    }
  }

  /**
   * Reset password endpoint
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      logger.info('Reset password request received');
      logger.info('Token in body:', token ? token.substring(0, 20) + '...' : 'MISSING');
      logger.info('Auth header:', req.headers.authorization ? 'Present' : 'Missing');

      if (!token || !newPassword || !confirmPassword) {
        res.status(400).json(
          ApiResponse.error('Token and password are required', 400)
        );
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json(
          ApiResponse.error('Passwords do not match', 400)
        );
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json(
          ApiResponse.error('Password must be at least 8 characters', 400)
        );
        return;
      }

      // Trim token to remove any whitespace
      const trimmedToken = String(token).trim();
      const result = await AuthService.resetPassword(trimmedToken, newPassword, confirmPassword);

      res.status(200).json(
        ApiResponse.success(result, result.message)
      );
    } catch (error) {
      logger.error('Reset password error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      res.status(400).json(ApiResponse.error(errorMessage, 400));
    }
  }
}
