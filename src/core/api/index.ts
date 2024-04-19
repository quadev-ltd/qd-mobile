import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { resendVerificationEmailMutation } from './resendVerificationEmail';
import { signUpMutation } from './signUp';
import {
  type VerifyEmailRequest,
  type BaseResponse,
  type ResendVerificationRequest,
  type SignUpRequest,
  type SignUpResponse,
} from './types';
import { verifyEmailMutation } from './verifyEmail';

import { env } from '@/core/env';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: env.BASE_URL,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    prepareHeaders: (headers, { getState }) => {
      const token = '(getState() as RootState)';
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set(
        'X-Request-Source',
        `${env.APPLICATION_NAME}/${env.APPLICATION_ENVIRONMENT}/${env.APPLICATION_VERSION}`,
      );
      return headers;
    },
  }),
  endpoints: builder => ({
    registerUser: builder.mutation<SignUpResponse, SignUpRequest>({
      query: signUpMutation,
    }),
    resendVerificationEmail: builder.mutation<
      BaseResponse,
      ResendVerificationRequest
    >({
      query: resendVerificationEmailMutation,
    }),
    verifyEmail: builder.mutation<BaseResponse, VerifyEmailRequest>({
      query: verifyEmailMutation,
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useResendVerificationEmailMutation,
  useVerifyEmailMutation,
} = apiSlice;
