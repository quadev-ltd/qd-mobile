import { t } from 'i18next';
import { useEffect, useState } from 'react';

import { useDeleteAccountMutation } from '..';
import { processError, type RTKQueryErrorType } from '../errors';

import { useAppSelector } from '@/core/state/hooks';
import { getUserDetailsSelector } from '@/core/state/selectors/user';

export const useDeleteAccount = () => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const user = useAppSelector(getUserDetailsSelector);
  const [deleteAccount, { isLoading, isSuccess, error }] =
    useDeleteAccountMutation();
  useEffect(() => {
    if (!error) {
      return;
    }
    processError(error as RTKQueryErrorType, t, {
      onUnmanagedError: message => {
        setErrorMessage(message);
      },
      onUnexpectedError: () => {
        setErrorMessage(t('error.serverSideError'));
      },
      logErrorMessage: `Unknown error while deleting user ${
        user.email
      }: ${JSON.stringify(error)}`,
    });
  }, [error, user.email]);
  const handleDeleteAccount = async () => {
    await deleteAccount(undefined);
  };

  return {
    handleDeleteAccount,
    isLoading,
    isSuccess,
    errorMessage,
  };
};
