import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { type RootState } from '../state/store';

import { getUserProfileQuery } from './getUserProfileQuery';
import { resendVerificationEmailMutation } from './resendVerificationEmailMutation';
import { signInMutation } from './signInMutation';
import { signUpMutation } from './signUpMutation';
import {
  type VerifyEmailRequest,
  type BaseResponse,
  type ResendVerificationRequest,
  type SignUpRequest,
  type SignUpResponse,
  type VerifyEmailResponse,
  type SignInRequest,
  type SignInResponse,
  type GetUserProfileResponse,
} from './types';
import { verifyEmailMutation } from './verifyEmailMutation';

import { env } from '@/core/env';

export const apiSlice = createApi({
  reducerPath: 'api',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({
    baseUrl: env.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.authToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      headers.set(
        'X-Request-Source',
        `${env.APPLICATION_NAME}/${env.APPLICATION_ENVIRONMENT}/${env.APPLICATION_VERSION}`,
      );
      return headers;
    },
  }),
  endpoints: builder => ({
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: signUpMutation,
    }),
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: signInMutation,
    }),
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
  }),
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
} = apiSlice;
