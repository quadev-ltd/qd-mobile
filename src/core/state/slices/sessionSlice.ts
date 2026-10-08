import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  type Claims,
  hasCompleteNames,
  isVerifiedUser,
  type ProviderNames,
  type SessionUser,
  type UserProfile,
} from '@/core/firebase/types';

export enum SessionStatus {
  /** Waiting for Firebase to report the signed-in user, or for that user's profile. */
  Initializing = 'initializing',
  SignedOut = 'signedOut',
  NeedsEmailVerification = 'needsEmailVerification',
  NeedsProfile = 'needsProfile',
  Ready = 'ready',
}

export type ProfileStatus = 'idle' | 'loading' | 'loaded' | 'missing' | 'error';

export interface SessionState {
  status: SessionStatus;
  /** False until Firebase reports the persisted session (or its absence) for the first time. */
  authResolved: boolean;
  user: SessionUser | null;
  profile: UserProfile | null;
  profileStatus: ProfileStatus;
  /** Set while Google/Apple sign-in creates the profile, so CompleteProfile does not flash. */
  profileSetupPending: boolean;
  providerNames: ProviderNames | null;
  claims: Claims;
}

export const initialSessionState: SessionState = {
  status: SessionStatus.Initializing,
  authResolved: false,
  user: null,
  profile: null,
  profileStatus: 'idle',
  profileSetupPending: false,
  providerNames: null,
  claims: { paid: false, admin: false },
};

/** The single place that decides which part of the app the user sees. */
export const deriveSessionStatus = (
  state: Omit<SessionState, 'status'>,
): SessionStatus => {
  if (!state.authResolved) {
    return SessionStatus.Initializing;
  }
  if (!state.user) {
    return SessionStatus.SignedOut;
  }
  if (!isVerifiedUser(state.user)) {
    return SessionStatus.NeedsEmailVerification;
  }
  if (
    state.profileStatus === 'idle' ||
    state.profileStatus === 'loading' ||
    state.profileSetupPending
  ) {
    return SessionStatus.Initializing;
  }
  if (state.profileStatus !== 'loaded' || !hasCompleteNames(state.profile)) {
    return SessionStatus.NeedsProfile;
  }
  return SessionStatus.Ready;
};

const updateStatus = (state: SessionState) => {
  state.status = deriveSessionStatus(state);
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState: initialSessionState,
  reducers: {
    authStateChanged: (state, action: PayloadAction<SessionUser | null>) => {
      const user = action.payload;
      if (!user) {
        return {
          ...initialSessionState,
          authResolved: true,
          status: SessionStatus.SignedOut,
        };
      }
      const previousUid = state.user?.uid;
      state.authResolved = true;
      if (previousUid !== user.uid) {
        state.profile = null;
        state.profileStatus = 'loading';
        state.claims = initialSessionState.claims;
        if (previousUid) {
          state.providerNames = null;
        }
      }
      state.user = user;
      updateStatus(state);
    },
    profileLoaded: (state, action: PayloadAction<UserProfile | null>) => {
      if (!state.user) {
        return;
      }
      state.profile = action.payload;
      state.profileStatus = action.payload ? 'loaded' : 'missing';
      updateStatus(state);
    },
    profileFailed: state => {
      if (!state.user) {
        return;
      }
      state.profileStatus = 'error';
      updateStatus(state);
    },
    profileSetupStarted: state => {
      state.profileSetupPending = true;
      updateStatus(state);
    },
    profileSetupFinished: state => {
      state.profileSetupPending = false;
      updateStatus(state);
    },
    providerNamesReceived: (state, action: PayloadAction<ProviderNames>) => {
      state.providerNames = action.payload;
    },
    claimsChanged: (state, action: PayloadAction<Claims>) => {
      state.claims = action.payload;
    },
  },
});

export const {
  authStateChanged,
  profileLoaded,
  profileFailed,
  profileSetupStarted,
  profileSetupFinished,
  providerNamesReceived,
  claimsChanged,
} = sessionSlice.actions;
