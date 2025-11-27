import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { authService } from '../services/index';
import logger from '../utils/logger';

/**
 * Forgot Password Page - Two-step password reset flow
 */
const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.forgotPassword(formData.email);
      if (response.success) {
        setUserEmail(formData.email);
        // Clear password fields and store the token
        setFormData({
          email: '',
          token: response.data.token,
          password: '',
          confirmPassword: '',
        });
        setStep('reset');
        logger.info('Password reset requested');
      } else {
        setError(response.message || 'Failed to request password reset');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to request password reset. Please try again.';
      setError(errorMsg);
      logger.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.token || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one digit');
      return;
    }

    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError('Password must contain at least one special character (!@#$%^&*)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.resetPassword({
        token: formData.token,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        setSuccess(true);
        // Clear form data
        setFormData({
          email: '',
          token: '',
          password: '',
          confirmPassword: '',
        });
        setUserEmail('');
        logger.info('Password reset successful');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Password reset failed');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Password reset failed. Please try again.';
      setError(errorMsg);
      logger.error('Reset password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
          <p className="text-white/70 mb-4">Your password has been successfully reset. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-purple-200">Recover your account access</p>
        </div>

        {/* Reset Password Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 space-y-4">
          <form onSubmit={step === 'email' ? handleRequestReset : handleResetPassword} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {step === 'email' ? (
              <>
                <p className="text-white/70 text-sm mb-4">
                  Enter your email address and we'll send you a password reset token.
                </p>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-white/50 transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-white/70 text-sm mb-4">
                  Your reset token has been sent to your email. It's been pre-filled below. Now set your new password.
                </p>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg outline-none text-white/60 cursor-not-allowed transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-white/50 transition"
                    placeholder="••••••••"
                    required
                  />
                  <p className="text-xs text-purple-200 mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special (!@#$%^&*)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-white/50 transition"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95 mt-6"
            >
              {step === 'email' ? 'Send Reset Token' : 'Reset Password'}
            </Button>
          </form>

          <p className="text-center text-white/70 text-sm mt-6">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-300 hover:text-purple-200 font-semibold transition"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
