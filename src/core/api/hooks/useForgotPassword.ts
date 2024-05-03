import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForgotPasswordMutation } from '..';
import { type RTKQueryErrorType, processError } from '../errors';

import {
  ForgotPasswordFields,
  type ForgotPasswordSchemaType,
} from '@/schemas/forgotPasswordSchema';

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [showStatus, setShowStatus] = useState(false);
  const [forgotPassword, { isLoading, isError, isSuccess }] =
    useForgotPasswordMutation();
  const [errorDisplay, setErrorDisplay] = useState<string | undefined>(
    undefined,
  );
  const requestPasswordReset = async (formData: ForgotPasswordSchemaType) => {
    try {
      setShowStatus(true);
      const sanitisedForm = {
        [ForgotPasswordFields.email]: formData[ForgotPasswordFields.email]
          .trim()
          .toLowerCase(),
      };
      await forgotPassword(sanitisedForm).unwrap();
    } catch (err) {
      processError(err as RTKQueryErrorType, t, {
        onUnmanagedError: message => {
          setErrorDisplay(message);
        },
        logErrorMessage: `Unknown error while requesting password reset for ${
          formData[ForgotPasswordFields.email]
        }: ${JSON.stringify(err)}`,
      });
    }
  };

  return {
    showStatus,
    setShowStatus,
    forgotPassword: requestPasswordReset,
    isLoading,
    isError,
    isSuccess,
    errorMessage: errorDisplay,
  };
};
