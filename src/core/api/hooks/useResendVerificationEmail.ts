import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { useResendVerificationEmailMutation } from '..';
import { APIError, type ResponseError } from '../types';

import logger from '@/core/logger';

const NOTIFICATION_DURATION = 2400;

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
    Toast.show({
      type: 'error',
      text1: t('toast.errorTitle'),
      text2: t('toast.unexpectedErrorRetry'),
      position: 'bottom',
    });
  }, [t]);

  const resendEmail = useCallback(async () => {
    const showSuccess = () => {
      setIsSendSuccess(true);
      timeoutRef.current = setTimeout(() => {
        setIsSendSuccess(false);
      }, NOTIFICATION_DURATION);
    };

    const showFailure = () => {
      setIsSendError(true);
      timeoutRef.current = setTimeout(() => {
        setIsSendError(false);
      }, NOTIFICATION_DURATION);
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
