import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useForgotPasswordMutation } from '..';
import { type RTKQueryErrorType, processError } from '../errors';

import logger from '@/core/logger';
import {
  ForgotPasswordFields,
  type ForgotPasswordSchemaType,
} from '@/schemas/forgotPasswordSchema';

export const useForgotPassword = () => {
  const { t } = useTranslation();
  const [showStatus, setShowStatus] = useState(false);
  const [forgotPassword, { isLoading, isError, isSuccess }] =
    useForgotPasswordMutation();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
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
      const resultError = err as RTKQueryErrorType;
      const displayMesssage = processError(resultError, t);
      if (displayMesssage) {
        setErrorMessage(displayMesssage);
      } else {
        logger().logError(
          Error(
            `Unknown error while requesting password reset for ${
              formData[ForgotPasswordFields.email]
            }: ${JSON.stringify(err)}`,
          ),
        );
      }
    }
  };

  return {
    showStatus,
    setShowStatus,
    forgotPassword: requestPasswordReset,
    isLoading,
    isError,
    isSuccess,
    errorMessage,
  };
};
