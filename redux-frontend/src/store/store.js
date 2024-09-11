// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import calculatorReducer from './calculatorSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    calculator: calculatorReducer,
  },
});

export default store;
