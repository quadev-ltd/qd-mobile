import { combineReducers } from '@reduxjs/toolkit';

import { authSlice } from '../slices/authSlice';
import { userSlice } from '../slices/userSlice';

import { apiSlice, anomalyDetectionApiSlice } from '@/core/api';

export const rootReducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [anomalyDetectionApiSlice.reducerPath]: anomalyDetectionApiSlice.reducer,
  [userSlice.reducerPath]: userSlice.reducer,
});
