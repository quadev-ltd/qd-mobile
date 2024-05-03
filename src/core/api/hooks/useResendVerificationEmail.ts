import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useResendVerificationEmailMutation } from '..';
import { type RTKQueryErrorType, processError } from '../errors';
import { APIError, type ResponseError } from '../types';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import logger from '@/core/logger';

export const GIF_NOTIFICATION_DURATION = 2400;

export const useResendEmail = (userID: string) => {
  const { t } = useTranslation();
  const [resendVerificationEmail, { isLoading: isSending }] =
    useResendVerificationEmailMutation();
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const [isSendError, setIsSendError] = useState(false);
  const [apiSendErrorCode, setAPISendErrorCode] = useState<
    APIError | undefined
  >();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const resendEmail = useCallback(async () => {
    const showSuccess = () => {
      setIsSendSuccess(true);
      timeoutRef.current = setTimeout(() => {
        setIsSendSuccess(false);
      }, GIF_NOTIFICATION_DURATION);
    };

    const showFailure = () => {
      setIsSendError(true);
      timeoutRef.current = setTimeout(() => {
        setIsSendError(false);
      }, GIF_NOTIFICATION_DURATION);
    };

    try {
      await resendVerificationEmail({ userID }).unwrap();
      showSuccess();
    } catch (err) {
      const typedError = err as ResponseError;
      if (typedError.status === 400) {
        if (typedError.data?.error === APIError.EmailVerifiedError) {
          setAPISendErrorCode(APIError.EmailVerifiedError);
        } else {
          logger().logError(
            Error(`Failed to resend email: ${JSON.stringify(err)}`),
          );
          showUnexpectedErrorToast(t);
        }
      }
      if (typedError.status === 429) {
        setAPISendErrorCode(APIError.TooManyRequestsError);
      } else {
        processError(err as RTKQueryErrorType, t, {
          onUnmanagedError: errorMessage =>
            showErrorToast(t('error.errorTitle'), errorMessage),
          onUnexpectedError: () => showUnexpectedErrorToast(t),
          logErrorMessage: `Failed to resend email: ${JSON.stringify(err)}`,
        });
      }
      showFailure();
    }
  }, [userID, resendVerificationEmail, t]);

  return {
    resendEmail,
    isSending,
    isSendSuccess,
    isSendError,
    apiSendErrorCode,
  };
};
