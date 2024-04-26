import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useResendVerificationEmailMutation } from '..';
import { APIError, type ResponseError } from '../types';

import { showUnexpectedErrorToast } from '@/components/Toast';
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

  const showToastNotification = useCallback(() => {
    showUnexpectedErrorToast(t);
  }, [t]);

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
          showToastNotification();
        }
      }
      if (typedError.status === 429) {
        setAPISendErrorCode(APIError.TooManyRequestsError);
      } else {
        logger().logError(
          Error(`Failed to resend email: ${JSON.stringify(err)}`),
        );
        showToastNotification();
      }
      showFailure();
    }
  }, [userID, resendVerificationEmail, showToastNotification]);

  return {
    resendEmail,
    isSending,
    isSendSuccess,
    isSendError,
    apiSendErrorCode,
  };
};
