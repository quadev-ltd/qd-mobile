import { type TFunction } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useResetPasswordMutation,
  useVerifyPasswordVerificationTokenQuery,
} from '..';
import {
  type RTKQueryErrorType,
  processCustomError,
  processError,
} from '../errors';

import { type ResetPasswordSchemaType } from '@/schemas/resetPasswordSchema';

const parseError = (rawError: RTKQueryErrorType, t: TFunction<'translate'>) => {
  let displayMessage = processError(rawError, t);
  if (!displayMessage) {
    displayMessage = processCustomError(rawError, t);
  }
  if (!displayMessage) {
    displayMessage = t('error.unexpectedErrorRetry');
  }
  return displayMessage;
};

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

  useEffect(() => {
    if (verificationError) {
      const displayMessage = parseError(verificationError, t);
      setErrorMessage(displayMessage);
    }
  }, [verificationError, t]);

  const resetUserPassword = useCallback(
    async (formData: ResetPasswordSchemaType) => {
      try {
        await resetPassword({
          userID: userID,
          verificationToken: verificationToken,
          password: formData.password,
        }).unwrap();
      } catch (err) {
        const displayMessage = parseError(err as RTKQueryErrorType, t);
        setErrorMessage(displayMessage);
      }
    },
    [resetPassword, t, userID, verificationToken],
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
