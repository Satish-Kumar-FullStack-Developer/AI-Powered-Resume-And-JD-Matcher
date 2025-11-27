import { useState } from 'react';
import { useAppDispatch } from './useRedux';
import apiService from '../services/apiService';
import logger from '../utils/logger';

/**
 * Custom hook for user signup
 */
export const useSignup = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.post('/api/auth/register', {
        email,
        password,
      });

      if (response.data.success) {
        logger.info('Signup successful for:', email);
        return { success: true, data: response.data };
      } else {
        const errorMsg = response.data.message || 'Signup failed';
        setError(errorMsg);
        logger.error('Signup error:', errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'An error occurred during signup';
      setError(errorMsg);
      logger.error('Signup exception:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading, error };
};

export default useSignup;
