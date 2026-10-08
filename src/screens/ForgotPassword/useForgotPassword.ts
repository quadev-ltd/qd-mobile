import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { sendPasswordReset } from '@/core/firebase/auth';
import {
  AuthErrorCode,
  getErrorCode,
  getErrorMessageKey,
  logFirebaseError,
} from '@/core/firebase/errors';
import {
  ForgotPasswordFields,
  type ForgotPasswordSchemaType,
} from '@/schemas/forgotPasswordSchema';

/**
 * Sends Firebase's password reset email; the reset itself happens on Firebase's hosted page.
 * Success is always the same neutral message: with email enumeration protection the app
 * cannot (and must not) tell whether an account exists.
 */
export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [showStatus, setShowStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const requestPasswordReset = async (formData: ForgotPasswordSchemaType) => {
    setShowStatus(true);
    setIsLoading(true);
    setIsSuccess(false);
    setErrorMessage(undefined);
    try {
      await sendPasswordReset(
        formData[ForgotPasswordFields.email].trim().toLowerCase(),
      );
      setIsSuccess(true);
    } catch (error) {
      if (getErrorCode(error) === AuthErrorCode.UserNotFound) {
        // Only without enumeration protection (e.g. the emulator): still say nothing.
        setIsSuccess(true);
      } else {
        logFirebaseError('sendPasswordReset', error);
        setErrorMessage(t(getErrorMessageKey(error)));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showStatus,
    setShowStatus,
    forgotPassword: requestPasswordReset,
    isLoading,
    isError: Boolean(errorMessage),
    isSuccess,
    errorMessage,
  };
};
