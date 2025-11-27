import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MatchingState, MatchResult } from '../types/index';

const initialState: MatchingState = {
  currentMatch: null,
  history: [],
  isLoading: false,
  error: null,
};

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setCurrentMatch: (state, action: PayloadAction<MatchResult>) => {
      state.currentMatch = action.payload;
      state.error = null;
    },

    setHistory: (state, action: PayloadAction<MatchResult[]>) => {
      state.history = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
  },
});

export const {
  setLoading,
  setCurrentMatch,
  setHistory,
  setError,
  clearError,
  clearCurrentMatch,
} = matchingSlice.actions;

export default matchingSlice.reducer;
