// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './courseSlice';

const store = configureStore({
  reducer: {
    courses: courseReducer,
  },
});

export default store;
