import {
  type BaseQueryApi,
  type FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { refreshTokens } from '../state/slices/authSlice';
import { type RootState } from '../state/store';

import { deleteAccountMutation } from './deleteAccountMutation';
import { forgotPasswordMutation } from './forgotPasswordMutation';
import { getUserProfileQuery } from './getUserProfileQuery';
import { refreshAuthTokensMutation } from './refreshAuthTokensMutation';
import { resendVerificationEmailMutation } from './resendVerificationEmailMutation';
import { resetPasswordMutation } from './resetPasswordMutation';
import { signInMutation } from './signInMutation';
import { signInWithFirebaseMutation } from './signInWithFirebaseMutation';
import { signUpMutation } from './signUpMutation';
import {
  type VerifyEmailRequest,
  type BaseResponse,
  type ResendVerificationRequest,
  type SignUpRequest,
  type SignUpResponse,
  type VerifyEmailResponse,
  type SignInRequest,
  type AuthenticationResponse as AuthResponse,
  type GetUserProfileResponse,
  type ForgotPasswordRequest,
  type VerifyResetPasswordTokenRequest,
  type ResetPasswordRequest,
  type RefreshAuthTokensRequest,
  type SignInWithFirebseRequest,
} from './types';
import { verifyEmailMutation } from './verifyEmailMutation';
import { verifyPasswordResetTokenQuery } from './verifyPasswordVerificationTokenQuery';

import { env } from '@/core/env';

const baseQuery = fetchBaseQuery({
  baseUrl: env.BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const { authToken } = (getState() as RootState).auth;
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }
    headers.set('Accept', 'application/json');
    headers.set(
      'X-Request-Source',
      `${env.APPLICATION_NAME}/${env.APPLICATION_ENVIRONMENT}/${env.APPLICATION_VERSION}`,
    );
    return headers;
  },
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const { authToken, tokenExpiry } = (api.getState() as RootState).auth;
  const isAuthenticated = authToken && tokenExpiry;
  if (isAuthenticated) {
    if (tokenExpiry.getTime() + 29 * 60 * 1000 <= Date.now()) {
      await api.dispatch(refreshTokens());
    }
  }
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401 && isAuthenticated) {
    const refreshResult = await api.dispatch(refreshTokens());
    if (refreshResult.meta.requestStatus === 'fulfilled') {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: signUpMutation,
    }),
    signIn: builder.mutation<AuthResponse, SignInRequest>({
      query: signInMutation,
    }),
    signInWithFirebase: builder.mutation<
      AuthResponse,
      SignInWithFirebseRequest
    >({
      query: signInWithFirebaseMutation,
    }),
    refreshAuthTokens: builder.mutation<AuthResponse, RefreshAuthTokensRequest>(
      {
        query: refreshAuthTokensMutation,
      },
    ),
    resendVerificationEmail: builder.mutation<
      BaseResponse,
      ResendVerificationRequest
    >({
      query: resendVerificationEmailMutation,
    }),
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: verifyEmailMutation,
    }),
    getUserProfile: builder.query<GetUserProfileResponse, undefined>({
      query: getUserProfileQuery,
    }),
    forgotPassword: builder.mutation<BaseResponse, ForgotPasswordRequest>({
      query: forgotPasswordMutation,
    }),
    verifyPasswordVerificationToken: builder.query<
      BaseResponse,
      VerifyResetPasswordTokenRequest
    >({
      query: verifyPasswordResetTokenQuery,
    }),
    resetPassword: builder.mutation<BaseResponse, ResetPasswordRequest>({
      query: resetPasswordMutation,
    }),
    deleteAccount: builder.mutation<BaseResponse, undefined>({
      query: deleteAccountMutation,
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignInWithFirebaseMutation,
  useRefreshAuthTokensMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
  useForgotPasswordMutation,
  useVerifyPasswordVerificationTokenQuery,
  useResetPasswordMutation,
  useDeleteAccountMutation,
} = apiSlice;
