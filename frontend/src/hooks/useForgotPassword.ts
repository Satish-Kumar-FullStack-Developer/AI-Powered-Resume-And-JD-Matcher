import { useState } from 'react';
import apiService from '../services/apiService';
import logger from '../utils/logger';

/**
 * Custom hook for password reset functionality
 */
export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const requestReset = async (email: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.post('/api/auth/forgot-password', {
        email,
      });

      if (response.data.success) {
        logger.info('Password reset email sent to:', email);
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.data.message || 'Failed to send reset email';
        setError(errorMsg);
        logger.error('Forgot password error:', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'An error occurred while requesting password reset';
      setError(errorMsg);
      logger.error('Forgot password exception:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, token: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.post('/api/auth/reset-password', {
        email,
        token,
        password,
      });

      if (response.data.success) {
        logger.info('Password reset successful for:', email);
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.data.message || 'Failed to reset password';
        setError(errorMsg);
        logger.error('Password reset error:', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'An error occurred while resetting password';
      setError(errorMsg);
      logger.error('Password reset exception:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { requestReset, resetPassword, loading, error };
};

export default useForgotPassword;
