import apiService from './apiService';

/**
 * Auth Service
 */
export const authService = {
  register: async (data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    const response = await apiService.post('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiService.post('/auth/login', { email, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await apiService.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  forgotPassword: async (email: string) => {
    const response = await apiService.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await apiService.post('/auth/reset-password', data);
    return response.data;
  },
};

/**
 * Matching Service
 */
export const matchingService = {
  compareResumeWithJD: async (resume: File, jdFile: File) => {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jd', jdFile);

    const response = await apiService.post('/matching/compare', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMatchHistory: async (limit: number = 10) => {
    const response = await apiService.get(`/matching/history?limit=${limit}`);
    return response.data;
  },
};
