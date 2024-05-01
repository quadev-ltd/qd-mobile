import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GIF_NOTIFICATION_DURATION } from './useResendVerificationEmail';

import { showUnexpectedErrorToast } from '@/components/Toast';
import { useVerifyEmailMutation } from '@/core/api';
import { type APIError, type ResponseError } from '@/core/api/types';
import logger from '@/core/logger';
import { useAppDispatch } from '@/core/state/hooks';
import { login } from '@/core/state/slices/authSlice';
import { setUserVerified } from '@/core/state/slices/userSlice';

export const useVerifyEmail = (userID: string, verificationToken?: string) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [apiErrorCode, setAPIErrorCode] = useState<APIError | undefined>();
  const [verifyEmail, { isLoading, isError, isSuccess }] =
    useVerifyEmailMutation();
  useEffect(() => {
    if (!userID || !verificationToken) return;
    verifyEmail({
      userID,
      verificationToken,
    })
      .unwrap()
      .then(data => {
        setTimeout(async () => {
          dispatch(
            login({
              authToken: data.authToken,
              refreshToken: data.refreshToken,
            }),
          );
          dispatch(setUserVerified());
        }, GIF_NOTIFICATION_DURATION);
      })
      .catch(err => {
        const typedError = err as ResponseError;
        if (typedError.status === 400) {
          setAPIErrorCode(typedError.data?.error as APIError | undefined);
        } else {
          logger().logError(
            Error(`Failed to verify email: ${JSON.stringify(err)}`),
          );
          showUnexpectedErrorToast(t);
        }
      });
  }, [userID, verificationToken, verifyEmail, t, dispatch]);

  return { isLoading, isError, isSuccess, apiErrorCode };
};
