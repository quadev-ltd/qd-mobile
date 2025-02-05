import auth from '@react-native-firebase/auth';
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
import { type RootState } from '../store';

import { getTokenExpiry, jwtDecode } from './jwt';
import {
  ClaimName,
  LOGOUT,
  type AuthState,
  AuthStateStatus,
  AccountStatus,
} from './types';

import { apiSlice } from '@/core/api';
import {
  type RTKQueryErrorType,
  processUnmanagedError,
} from '@/core/api/errors';
import logger from '@/core/logger';
import { secondsToDate } from '@/util';

const initialState: AuthState = {
  status: AuthStateStatus.Pending,
  authToken: undefined,
  tokenExpiry: undefined,
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
      const decodedToken = jwtDecode(newAuthToken);
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
      const response = await dispatch(
        apiSlice.endpoints.refreshAuthTokens.initiate({ refreshToken }),
      ).unwrap();
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
            statusCode === 401 && dispatch(logout());
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
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const authToken = await retrieveAuthToken();
      if (authToken != null) {
        const state = getState() as RootState;
        if (
          !state.user.accountStatus ||
          state.user.accountStatus === AccountStatus.Unverified
        ) {
          logger().logError(
            Error('Auth tokens provided but user is still unverified.'),
          );
          dispatch(logout());
          return rejectWithValue(
            'uth tokens provided but user is still unverified.',
          );
        }
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
      if (auth().currentUser) {
        const displayName = auth().currentUser?.displayName;
        const email = auth().currentUser?.email;
        auth()
          .signOut()
          .then(() => {
            logger().logMessage(
              `Firebase logout successful for user ${displayName}: ${email}`,
            );
          })
          .catch(error => {
            logger().logError(
              new Error(`Firebase logout failed: ${JSON.stringify(error)}`),
            );
          });
      }
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
  reducers: {},
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
