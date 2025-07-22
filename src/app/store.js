import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from '../feature/comments/commentsSlice';

export const store = configureStore({
  reducer: {
    comments: commentsReducer,
  },
});