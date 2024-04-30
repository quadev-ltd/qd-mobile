import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type TFunction } from 'i18next';

import { FieldErrors, APIError } from './types';

import logger from '@/core/logger';

export const AsynchErrorMessages = (
  t: TFunction<'translate'>,
  error: string,
): string | undefined => {
  switch (error) {
    case FieldErrors.AlreadyUsed:
      return t('fieldError.emailAlreadyUsedError');
    case FieldErrors.InvalidEmailPassword:
      return t('fieldError.invalidEmailOrPasswordError');
    case FieldErrors.Complex:
    case FieldErrors.Email:
    case FieldErrors.MaxLength:
    case FieldErrors.NotFuture:
    case FieldErrors.Required:
    default:
      return;
  }
};

const RPC_ERROR_PREFIX = 'rpc error: code = InvalidArgument desc = ';

export type RTKQueryErrorType = FetchBaseQueryError | SerializedError;

export const processError = (
  error: RTKQueryErrorType,
  t: TFunction<'translate'>,
) => {
  if ('status' in error) {
    const serverError = error as FetchBaseQueryError;
    switch (serverError.status) {
      case 'FETCH_ERROR':
        return t('error.networkError');
      case 'PARSING_ERROR':
        logger().logError(Error(`Parsing error ${serverError.error}`));
        return t('error.serverSideError');
      case 'CUSTOM_ERROR':
        logger().logError(Error(`Custom error ${serverError.error}`));
        return t('error.serverSideError');
      case 'TIMEOUT_ERROR':
        logger().logError(Error(`Timeout error ${serverError.error}`));
        return t('error.networkError');
      default:
        return;
    }
  } else if ('error' in error) {
    // Handle client-side errors like network issues
    const clientError = error as { error: string; message: string };
    const errorMessage = `${clientError.error}: ${clientError.message}`;
    logger().logError(Error(`Client side error: ${errorMessage}`));
    return t('error.unexpectedErrorRetry');
  }
  return t('error.unexpectedErrorRetry');
};

export const processCustomError = (
  error: FetchBaseQueryError | SerializedError,
  t: TFunction<'translate'>,
) => {
  const serverError = error as FetchBaseQueryError;
  if (!serverError.data) {
    logger().logError(
      Error(`Unknown server error: ${JSON.stringify(serverError)}`),
    );
    return;
  }
  switch (
    (serverError.data as { error: string }).error.replace(RPC_ERROR_PREFIX, '')
  ) {
    case APIError.InvalidTokenError:
    case APIError.InvalidUserIDError:
      return t('error.linkCorruptedError');
    case APIError.TokenExpiredError:
      return t('error.tokenExpiredError');
    default:
      logger().logError(
        Error(`Unknown server error: ${JSON.stringify(serverError)}`),
      );
      return t('error.unexpectedErrorRetry');
  }
};
