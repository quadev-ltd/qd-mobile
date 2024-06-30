import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type RTKQueryErrorType, processError } from '../errors';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import { useVerifyEmailMutation } from '@/core/api';
import { APIError, type ResponseError } from '@/core/api/types';
import { useAppDispatch } from '@/core/state/hooks';
import { login } from '@/core/state/slices/authSlice';

export const useVerifyEmail = (userID: string, verificationToken?: string) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [apiErrorCode, setAPIErrorCode] = useState<APIError | undefined>();
  const [verifyEmail, { isLoading, isError }] = useVerifyEmailMutation();
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  useEffect(() => {
    if (!userID || !verificationToken) return;
    verifyEmail({
      userID,
      verificationToken,
    })
      .unwrap()
      .then(data => {
        dispatch(
          login({
            authToken: data.authToken,
            refreshToken: data.refreshToken,
          }),
        );
        setIsVerificationSuccess(true);
      })
      .catch(err => {
        const typedError = err as ResponseError;
        if (typedError.status === 400) {
          setAPIErrorCode(typedError.data?.error as APIError | undefined);
        } else {
          processError(err as RTKQueryErrorType, t, {
            onUnmanagedError: message => {
              showErrorToast(t('error.errorTitle'), message);
            },
            onUnexpectedError: () => showUnexpectedErrorToast(t),
            logErrorMessage: `Failed to verify email: ${JSON.stringify(err)}`,
          });
          setAPIErrorCode(APIError.UnmanagedError);
        }
      });
  }, [userID, verificationToken, verifyEmail, t, dispatch]);

  return { isLoading, isError, isSuccess: isVerificationSuccess, apiErrorCode };
};
