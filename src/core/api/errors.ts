import { type SerializedError } from '@reduxjs/toolkit';
import { type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { type TFunction } from 'i18next';

import { FieldErrors, APIError } from './types';

import logger from '@/core/logger';

export const asynchErrorMessages = (
  t: TFunction<'translate'>,
  error: string,
): string | undefined => {
  switch (error) {
    case FieldErrors.AlreadyUsed:
      return t('fieldError.emailAlreadyUsedError');
    case FieldErrors.InvalidEmailPassword:
      return t('fieldError.invalidEmailOrPasswordError');
    case FieldErrors.Complex:
      return t('fieldError.passwordNotComplexError');
    case FieldErrors.Email:
      return t('fieldError.emailFormatError');
    case FieldErrors.MaxLength:
      return t('fieldError.maxLengthError');
    case FieldErrors.Required:
      return t('fieldError.requiredError');
    case FieldErrors.NotFuture:
    default:
      return;
  }
};

const RPC_ERROR_PREFIX = 'rpc error: code = InvalidArgument desc = ';

export type RTKQueryErrorType = FetchBaseQueryError | SerializedError;

export const processUnmanagedError = (
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
    return;
  }
};

export const processVerificationError = (
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

interface ProcessErrorOptions {
  onUnmanagedError?: (errorMessage: string) => void;
  onUnexpectedError?: () => void;
  logErrorMessage?: string;
}
export const processError = (
  err: RTKQueryErrorType,
  t: TFunction<'translate'>,
  options?: ProcessErrorOptions,
) => {
  const errorMessage = processUnmanagedError(err, t);
  if (errorMessage) {
    options?.onUnmanagedError?.(errorMessage);
  } else {
    options?.logErrorMessage &&
      logger().logError(Error(options?.logErrorMessage));
    options?.onUnexpectedError?.();
  }
};
