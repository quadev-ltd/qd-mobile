import { createSelector } from '@reduxjs/toolkit';

import { AuthStateStatus } from '../slices/authSlice';
import { type RootState } from '../store';

import { isUserVerifiedSelector } from './user';

const isAuthenticated = createSelector(
  (state: RootState) => state.auth.status === AuthStateStatus.Authenticated,
  isUserVerifiedSelector,
  (isAuthenticatedValue, isVerified) => isAuthenticatedValue && isVerified,
);

export const isAuthenticatedSelector = (state: RootState) =>
  isAuthenticated(state);
