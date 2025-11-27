/**
 * Validators for API input
 */

export class InputValidator {
  /**
   * Validate file upload request
   */
  static validateFileUpload(resume: Express.Multer.File | undefined, jd: Express.Multer.File | undefined) {
    if (!resume || !jd) {
      throw new Error('Both resume and job description files are required.');
    }

    if (!resume.originalname.match(/\.(pdf|docx)$/i)) {
      throw new Error('Resume must be PDF or DOCX format.');
    }

    if (!jd.originalname.match(/\.(pdf|docx|txt)$/i)) {
      throw new Error('Job description must be PDF, DOCX, or TXT format.');
    }
  }

  /**
   * Validate email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one digit.');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*).');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate user registration data
   */
  static validateUserRegistration(data: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  }): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.email) {
      errors.push('Email is required.');
    } else if (!this.validateEmail(data.email)) {
      errors.push('Invalid email format.');
    }

    if (!data.password) {
      errors.push('Password is required.');
    } else {
      const passwordValidation = this.validatePassword(data.password);
      if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
      }
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Sanitize text input
   */
  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 10000); // Limit to 10k characters
  }
}
