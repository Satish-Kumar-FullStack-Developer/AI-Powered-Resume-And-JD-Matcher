import { useState } from 'react';
import { useAppDispatch } from './useRedux';
import { authService } from '../services/index';
import { loginSuccess, setError, setLoading } from '../store/authSlice';

/**
 * Login Hook
 */
export const useLogin = () => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );
        return { success: true };
      } else {
        dispatch(setError(response.message || 'Login failed'));
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  return { login, isSubmitting };
};
