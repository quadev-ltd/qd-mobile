import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { t } from 'i18next';
import Toast from 'react-native-toast-message';

import {
  deleteAuthToken,
  deleteRefreshToken,
  retrieveAuthToken,
  retrieveRefreshToken,
  storeAuthToken,
  storeRefreshToken,
} from '../keychain';

import { ClaimName, LOGOUT, type TokenPayload } from './types';
import { jwtDecode } from './util';

import {
  type RTKQueryErrorType,
  processUnmanagedError,
} from '@/core/api/errors';
import { refreshAuthTokens } from '@/core/api/refreshAuthTokens';
import logger from '@/core/logger';
import { secondsToDate } from '@/util';

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
  status: AuthStateStatus.Pending,
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

const getTokenExpiry = (token: string | null) => {
  if (token === null) {
    throw new Error('No refresh token found');
  }
  const decodedToken = decodeToken(token);
  if (!decodedToken[ClaimName.ExpiryClaim]) {
    throw new Error('Token does not contain expiry claim');
  }
  return secondsToDate(decodedToken[ClaimName.ExpiryClaim]);
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
        tokenExpiry: secondsToDate(decodedToken[ClaimName.ExpiryClaim]),
      };
    } catch (error) {
      logger().logError(Error(`Failed to login: ${error}`));
      return rejectWithValue(error);
    }
  },
);

export const refreshTokens = createAsyncThunk(
  'auth/refreshTokens',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const refreshToken = await retrieveRefreshToken();
      const tokenExpiry = getTokenExpiry(refreshToken);
      if (tokenExpiry.getTime() < Date.now()) {
        throw new Error('Refresh token has expired');
      }
      const response = await refreshAuthTokens(refreshToken as string);
      logger().logMessage(
        'Authentication token successfully refreshed and claims decoded.',
      );
      dispatch(login(response));
      return;
    } catch (error) {
      let errorMessage;
      if ((error as FetchBaseQueryError).status) {
        errorMessage = processUnmanagedError(error as RTKQueryErrorType, t);
        if (!errorMessage) {
          const statusCode = (error as FetchBaseQueryError).status as number;
          if (statusCode >= 400 && statusCode < 500) {
            errorMessage = t('error.unauthorizedError');
            dispatch(logout());
          }
          if (statusCode >= 500 && statusCode < 600) {
            errorMessage = t('error.serverSideError');
          }
        }
      } else {
        errorMessage = t('error.refreshSessionError');
        logger().logError(
          Error(
            `Failed to refresh tokens: ${JSON.stringify(error)}. Logging out.`,
          ),
        );
        dispatch(logout());
      }
      Toast.show({
        type: 'error',
        text1: t('error.errorTitle'),
        text2: errorMessage,
        position: 'bottom',
      });
      return rejectWithValue(error);
    }
  },
);

export const loadInitialToken = createAsyncThunk(
  'auth/loadInitialToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const authToken = await retrieveAuthToken();
      if (authToken != null) {
        const tokenExpiry = getTokenExpiry(authToken);
        if (tokenExpiry.getTime() < Date.now()) {
          logger().logMessage(
            'Authentication token has expired. Requesting new tokens.',
          );
          dispatch(refreshTokens());
          return;
        } else {
          const authTokenObj = {
            authToken: authToken as string,
            tokenExpiry,
          };
          logger().logMessage('Token successfully decoded and verified.');
          return authTokenObj;
        }
      }
      return rejectWithValue('User is not loggeed in.');
    } catch (err) {
      logger().logError(
        Error(
          `Failed to retrieve tokens from keychain: ${err}. Tokens will be removed from keychain.`,
        ),
      );
      dispatch(logout());
      return rejectWithValue(err);
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

const unauthenticatedInitialState = {
  ...initialState,
  status: AuthStateStatus.Unauthenticated,
};

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
      .addCase(logout.fulfilled, () => {
        logger().logMessage(`${sliceName} slice logout successfully`);
        return unauthenticatedInitialState;
      })
      .addCase(login.rejected, () => unauthenticatedInitialState)
      .addCase(loadInitialToken.rejected, () => unauthenticatedInitialState)
      .addMatcher(
        isFulfilled(login, refreshTokens, loadInitialToken),
        (state, action: PayloadAction<AuthTokenPayload | undefined>) => {
          state.status = AuthStateStatus.Authenticated;
          if (action.payload) {
            state.authToken = action.payload.authToken;
            state.tokenExpiry = action.payload.tokenExpiry;
          }
        },
      );
  },
});

export const { setAuthToken } = authSlice.actions;
