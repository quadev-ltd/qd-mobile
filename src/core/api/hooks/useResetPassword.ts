import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useResetPasswordMutation,
  useVerifyPasswordVerificationTokenQuery,
} from '..';
import {
  type RTKQueryErrorType,
  processVerificationError,
  processError,
} from '../errors';

import { type ResetPasswordSchemaType } from '@/schemas/resetPasswordSchema';

export const useResetPassword = (userID: string, verificationToken: string) => {
  const { t } = useTranslation();
  const {
    isError: isNotVerified,
    isFetching: isFetchingVerification,
    isLoading: isLoadingVerification,
    refetch,
    error: verificationError,
  } = useVerifyPasswordVerificationTokenQuery({
    userID: userID,
    verificationToken: verificationToken,
  });

  const [
    resetPassword,
    { isLoading: isReseting, isError: didNotReset, isSuccess: isResetSuccess },
  ] = useResetPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const parseError = useCallback(
    (rawError: RTKQueryErrorType) => {
      const displayError = processVerificationError(rawError, t);
      if (displayError) {
        setErrorMessage(displayError);
      } else {
        processError(rawError, t, {
          onUnmanagedError: setErrorMessage,
          onUnexpectedError: () =>
            setErrorMessage(t('error.unexpectedErrorRetry')),
        });
      }
    },
    [t],
  );

  useEffect(() => {
    if (verificationError) {
      parseError(verificationError);
    }
  }, [verificationError, parseError]);

  const resetUserPassword = useCallback(
    async (formData: ResetPasswordSchemaType) => {
      try {
        await resetPassword({
          userID: userID,
          verificationToken: verificationToken,
          password: formData.password,
        }).unwrap();
      } catch (err) {
        parseError(err as RTKQueryErrorType);
      }
    },
    [resetPassword, parseError, userID, verificationToken],
  );

  const tryAgain = () => {
    !didNotReset && !isResetSuccess && refetch();
    setErrorMessage(undefined);
  };

  const isError = (isNotVerified || didNotReset) && Boolean(errorMessage);
  const isLoading =
    isLoadingVerification || isFetchingVerification || isReseting;

  return {
    isResetSuccess,
    isError,
    isLoading,
    errorMessage,
    resetPassword: resetUserPassword,
    tryAgain,
  };
};
