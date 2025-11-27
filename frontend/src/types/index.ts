/**
 * Type Definitions
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface MatchResult {
  id: string;
  matchPercentage: number;
  matchedKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface MatchingState {
  currentMatch: MatchResult | null;
  history: MatchResult[];
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  matching: MatchingState;
}
