import jwt from 'jsonwebtoken';
import { JWT_CONSTANTS } from '../constants/index';
import User, { IUser } from '../models/User';
import logger from '../config/logger';

/**
 * Authentication Service - Simple and Reliable
 */
export class AuthService {
  /**
   * Register new user
   */
  static async registerUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<IUser> {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already registered with this email.');
      }

      const user = new User(userData);
      await user.save();

      logger.info('User registered successfully:', userData.email);
      return user;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  static async loginUser(email: string, password: string): Promise<{
    user: IUser;
    token: string;
  }> {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid email or password.');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password.');
      }

      const token = this.generateToken(user);

      logger.info('User logged in successfully:', email);
      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT token
   */
  static generateToken(user: IUser): string {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      JWT_CONSTANTS.SECRET,
      {
        expiresIn: JWT_CONSTANTS.EXPIRY,
      }
    );
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): {
    id: string;
    email: string;
  } {
    try {
      return jwt.verify(token, JWT_CONSTANTS.SECRET) as {
        id: string;
        email: string;
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  /**
   * Request password reset - returns JWT reset token
   */
  static async requestPasswordReset(email: string): Promise<{ token: string }> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('No user found with this email address.');
      }

      // Create a special reset token that expires in 1 hour
      const resetToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          type: 'reset',
        },
        JWT_CONSTANTS.SECRET,
        { expiresIn: '1h' }
      );

      logger.info('Password reset token generated for:', email);
      return { token: resetToken };
    } catch (error) {
      logger.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password - validates JWT and updates password
   */
  static async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      logger.info('Reset password attempt - Token (first 50 chars):', token.substring(0, 50));
      logger.info('Token length:', token.length);
      
      // Verify the JWT token
      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_CONSTANTS.SECRET) as any;
      } catch (jwtError: any) {
        logger.error('JWT verification failed:', jwtError.message);
        if (jwtError.name === 'TokenExpiredError') {
          throw new Error('Reset token has expired. Please request a new password reset.');
        }
        if (jwtError.name === 'JsonWebTokenError') {
          throw new Error('Invalid reset token. Please make sure you copied the token correctly.');
        }
        throw jwtError;
      }

      logger.info('JWT decoded successfully. Type:', decoded.type);

      if (decoded.type !== 'reset') {
        throw new Error('Invalid reset token.');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters.');
      }

      // Find user and update password
      const user = await User.findById(decoded.id).select('+password');
      if (!user) {
        throw new Error('User not found.');
      }

      user.password = newPassword;
      await user.save();

      logger.info('Password reset successfully for:', user.email);
      return {
        success: true,
        message: 'Password reset successfully. Please login with your new password.',
      };
    } catch (error: any) {
      logger.error('Password reset error:', error);
      
      throw error;
    }
  }
}

