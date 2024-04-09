import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/core/env';
import { RegisterUserResponse, SignUpFormType, signUpMutation } from './signUp';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://127.0.0.1:9000/api/v1', // env.BASE_URL,
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
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponse, SignUpFormType>({
      query: signUpMutation,
    }),
  }),
});

export const { useRegisterUserMutation } = apiSlice;