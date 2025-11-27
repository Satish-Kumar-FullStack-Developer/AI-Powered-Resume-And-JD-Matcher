import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import matchingReducer from './matchingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matching: matchingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
