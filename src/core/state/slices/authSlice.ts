import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  deleteAuthToken,
  deleteRefreshToken,
  retrieveAuthToken,
  storeAuthToken,
  storeRefreshToken,
} from '../keychain';

import { ClaimName, LOGOUT, type TokenPayload } from './types';
import { isUserVerifiedSelector } from './userSlice';
import { jwtDecode } from './util';

import logger from '@/core/logger';
import { type RootState } from '@/core/state/store';

export enum AuthStateStatus {
  Pending = 'PENDING',
  Authenticated = 'AUTHENTICATED',
  Unauthenticated = 'UNAUTHENTICATED',
}

export enum AccountStatus {
  Unverified = 'Unverified',
  Verified = 'Verified',
}

interface AuthState {
  status: AuthStateStatus;
  authToken?: string;
  tokenExpiry?: Date;
}

const initialState: AuthState = {
  status: AuthStateStatus.Unauthenticated,
  authToken: undefined,
  tokenExpiry: undefined,
};

// TODO: Remove mock data
const decodeToken = (token: string): TokenPayload => {
  if (token === 'auth_token') {
    return {
      [ClaimName.ExpiryClaim]: Date.now() / 1000 + 3600,
      [ClaimName.EmailClaim]: 'test@test.com',
      [ClaimName.IssuedAtClaim]: Date.now() / 1000,
      [ClaimName.NonceClaim]: 'nonce',
      [ClaimName.TypeClaim]: 'access',
      [ClaimName.UserIDClaim]: '123',
    };
  }
  return jwtDecode(token);
};

export interface TokensPayload {
  authToken: string;
  refreshToken: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async (
    { authToken: newAuthToken, refreshToken }: TokensPayload,
    { rejectWithValue },
  ) => {
    try {
      const decodedToken = decodeToken(newAuthToken);
      logger().logMessage(
        'Token successfully decoded. Storing tokens in keychain.',
      );
      await storeAuthToken(newAuthToken);
      await storeRefreshToken(refreshToken);
      return {
        authToken: newAuthToken,
        tokenExpiry: new Date(decodedToken[ClaimName.ExpiryClaim] * 1000),
      };
    } catch (error) {
      logger().logError(Error(`Failed to login: ${error}`));
      return rejectWithValue(error);
    }
  },
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async () => {
    // async (_, { rejectWithValue, getState }) => {
    //     // try {
    //     //   const refreshToken = await retrieveRefreshToken();
    //     //   const response = await refreshAuthToken(refreshToken.password);
    //     //   await Keychain.setGenericPassword('authToken', response.authToken, { service: 'authTokenService' });
    //     //   return response.authToken;
    //     // } catch (error) {
    //     //   return rejectWithValue(error.response.data);
    //     // }
  },
);

export const loadInitialToken = createAsyncThunk(
  'auth/loadInitialToken',
  async (_, { dispatch }) => {
    const token = await retrieveAuthToken();
    if (token !== null) {
      try {
        const decodedToken = decodeToken(token);
        if (!decodedToken[ClaimName.ExpiryClaim]) {
          throw new Error('Token does not contain expiry claim');
        }
        if (decodedToken[ClaimName.ExpiryClaim] < Date.now() / 1000) {
          await refreshTokens();
        } else {
          const authToken = {
            authToken: token,
            tokenExpiry: new Date(decodedToken[ClaimName.ExpiryClaim] * 1000),
          };
          logger().logMessage('Token successfully decoded. And verified.');
          dispatch(setAuthToken(authToken));
        }
      } catch (err) {
        logger().logError(
          Error(
            `Failed to decode token: ${err}. Tokens will be removed from keychain.`,
          ),
        );
        await deleteAuthToken();
        await deleteRefreshToken();
      }
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await deleteAuthToken();
      await deleteRefreshToken();
      logger().logMessage('Keychain logout successful.');
      dispatch({ type: LOGOUT });
    } catch (error) {
      logger().logError(Error(`Logout failed: ${error}`));
      return rejectWithValue(error);
    }
  },
);

export interface AuthTokenPayload {
  authToken?: string;
  tokenExpiry?: Date;
}

const sliceName = 'auth';
export const authSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<AuthTokenPayload>) => {
      state.status = AuthStateStatus.Authenticated;
      state.authToken = action.payload.authToken;
      state.tokenExpiry = action.payload.tokenExpiry;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = AuthStateStatus.Pending;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthTokenPayload>) => {
          state.status = AuthStateStatus.Authenticated;
          state.authToken = action.payload.authToken;
          state.tokenExpiry = action.payload.tokenExpiry;
        },
      )
      .addCase(login.rejected, () => initialState)
      .addCase(logout.fulfilled, () => {
        logger().logMessage(`${sliceName} slice logout successfully`);
        return initialState;
      });
  },
});

export const { setAuthToken } = authSlice.actions;

const isAuthenticated = createSelector(
  (state: RootState) => state.auth.status === AuthStateStatus.Authenticated,
  isUserVerifiedSelector,
  (isAuthenticatedValue, isVerified) => isAuthenticatedValue && isVerified,
);

export const isAuthenticatedSelector = (state: RootState) =>
  isAuthenticated(state);
