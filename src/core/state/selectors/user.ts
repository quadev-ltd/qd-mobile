import { AccountStatus } from '../slices/types';
import { type RootState } from '../store';

export const isUserVerifiedSelector = (state: RootState) =>
  state.user?.accountStatus === AccountStatus.Verified;

export const getUserDetailsSelector = (state: RootState) => state.user;
