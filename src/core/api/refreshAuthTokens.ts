import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { env } from '../env';

import { type RTKQueryErrorType } from './errors';
import { APIEndpoints, type AuthenticationResponse } from './types';

export interface RefreshError {
  message: string;
  status?: number;
}

export const refreshAuthTokens = async (
  refreshToken: string,
): Promise<AuthenticationResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${env.BASE_URL}${APIEndpoints.RefreshAuthTokens}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw {
        status: response.status,
      } as RTKQueryErrorType;
    }

    const data = (await response.json()) as AuthenticationResponse;
    return data;
  } catch (error) {
    if (!(error as FetchBaseQueryError).status) {
      if ((error as Error).message === 'Network request failed') {
        throw {
          status: 'FETCH_ERROR',
        } as RTKQueryErrorType;
      }
      if ((error as Error).name === 'AbortError') {
        throw {
          status: 'TIMEOUT_ERROR',
        } as RTKQueryErrorType;
      }
      throw {
        status: 'UNKNOWN_ERROR',
      } as RTKQueryErrorType;
    }
    throw error;
  }
};
