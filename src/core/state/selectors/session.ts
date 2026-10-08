import { type RootState } from '../store';

export const selectSession = (state: RootState) => state.session;
export const selectSessionStatus = (state: RootState) => state.session.status;
export const selectSessionUser = (state: RootState) => state.session.user;
export const selectProfile = (state: RootState) => state.session.profile;
export const selectProviderNames = (state: RootState) =>
  state.session.providerNames;
export const selectClaims = (state: RootState) => state.session.claims;
