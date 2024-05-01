import { AccountStatus } from '../slices/authSlice';
import { type RootState } from '../store';

export const isUserVerifiedSelector = (state: RootState) =>
  state.user?.accountStatus === AccountStatus.Verified;
