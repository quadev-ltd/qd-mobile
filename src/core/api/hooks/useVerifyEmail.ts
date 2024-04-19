import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import { useVerifyEmailMutation } from '@/core/api';
import { type APIError } from '@/core/api/constants';
import { type ResponseError } from '@/core/api/types';
import logger from '@/core/logger';

export const useVerifyEmail = (userID: string, verificationToken?: string) => {
  const { t } = useTranslation();
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
      .catch(err => {
        const typedError = err as ResponseError;
        if (typedError.status === 400) {
          setAPIErrorCode(typedError.data?.error as APIError | undefined);
        } else {
          logger().logError(
            Error(`Failed to verify email: ${JSON.stringify(err)}`),
          );
          Toast.show({
            type: 'error',
            text1: t('toast.errorTitle'),
            text2: t('toast.unexpecteError'),
            position: 'bottom',
          });
        }
      });
  }, [userID, verificationToken, verifyEmail, t]);

  return { isLoading, isError, isSuccess, apiErrorCode };
};
