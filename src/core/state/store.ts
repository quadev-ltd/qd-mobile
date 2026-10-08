import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { anomalyDetectionApiSlice } from '../api';

import { sessionSlice } from './slices/sessionSlice';

// No persistence: Firebase keeps the session and Firestore caches the profile offline.
export const rootReducer = combineReducers({
  [sessionSlice.reducerPath]: sessionSlice.reducer,
  [anomalyDetectionApiSlice.reducerPath]: anomalyDetectionApiSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(anomalyDetectionApiSlice.middleware),
  });

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
