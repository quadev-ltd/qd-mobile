import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  deleteAccessToken,
  deleteRefreshToken,
  retrieveAccessToken,
  storeAccessToken,
  storeRefreshToken,
} from '../keychain';

import { ClaimName, type TokenPayload } from './types';
import { jwtDecode } from './util';

import logger from '@/core/logger';
import { type RootState } from '@/core/state/store';

export interface AuthStateUser {
  accessToken: string;
  tokenExpiry: Date;
}

export enum AuthStateStatus {
  Pending = 'PENDING',
  Authenticated = 'AUTHENTICATED',
  Unauthenticated = 'UNAUTHENTICATED',
}

interface AuthState {
  status: AuthStateStatus;
  user: AuthStateUser | null;
}

const initialState: AuthState = {
  status: AuthStateStatus.Pending,
  user: null,
};

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

interface LoginParams {
  accessToken: string;
  refreshToken: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async (
    { accessToken: newAccessToken, refreshToken }: LoginParams,
    { rejectWithValue },
  ) => {
    try {
      const decodedToken = decodeToken(newAccessToken);
      logger().logMessage(
        'Token successfully decoded. Storing tokens in keychain.',
      );
      await storeAccessToken(newAccessToken);
      await storeRefreshToken(refreshToken);
      return {
        accessToken: newAccessToken,
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
    //     console.log('Refreshing token::::');
    //     // try {
    //     //   const refreshToken = await retrieveRefreshToken();
    //     //   const response = await refreshAccessToken(refreshToken.password);
    //     //   await Keychain.setGenericPassword('accessToken', response.accessToken, { service: 'accessTokenService' });
    //     //   return response.accessToken;
    //     // } catch (error) {
    //     //   return rejectWithValue(error.response.data);
    //     // }
  },
);

export const loadInitialToken = createAsyncThunk(
  'auth/loadInitialToken',
  async (_, { dispatch }) => {
    const token = await retrieveAccessToken();
    if (token !== null) {
      try {
        const decodedToken = decodeToken(token);
        if (!decodedToken[ClaimName.ExpiryClaim]) {
          throw new Error('Token does not contain expiry claim');
        }
        if (decodedToken[ClaimName.ExpiryClaim] < Date.now() / 1000) {
          await refreshTokens();
        } else {
          const accessToken = {
            accessToken: token,
            tokenExpiry: new Date(decodedToken[ClaimName.ExpiryClaim] * 1000),
          };
          logger().logMessage('Token successfully decoded. And verified.');
          dispatch(setAccessToken(accessToken));
        }
      } catch (err) {
        logger().logError(
          Error(
            `Failed to decode token: ${err}. Tokens will be removed from keychain.`,
          ),
        );
        await deleteAccessToken();
        await deleteRefreshToken();
      }
    }
  },
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await deleteAccessToken();
      await deleteRefreshToken();
      logger().logMessage('Logout successful.');
    } catch (error) {
      logger().logError(Error(`Logout failed: ${error}`));
      return rejectWithValue(error);
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<AuthStateUser>) => {
      state.status = AuthStateStatus.Authenticated;
      state.user = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = AuthStateStatus.Pending;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthStateUser>) => {
          state.status = AuthStateStatus.Authenticated;
          state.user = action.payload;
        },
      )
      .addCase(login.rejected, state => {
        state.status = AuthStateStatus.Unauthenticated;
        state.user = null;
      })
      .addCase(logout.fulfilled, state => {
        state.status = AuthStateStatus.Unauthenticated;
        state.user = null;
      });
  },
});

export const { setAccessToken } = authSlice.actions;

export const authStatusSelector = (state: RootState) => state.auth.status;
