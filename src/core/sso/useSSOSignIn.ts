import { useTranslation } from 'react-i18next';

import { useSignInWithFirebaseMutation } from '../api';
import {
  asynchErrorMessages,
  processError,
  type RTKQueryErrorType,
} from '../api/errors';
import { type ResponseError } from '../api/types';
import logger from '../logger';
import { useAppDispatch } from '../state/hooks';
import { login } from '../state/slices/authSlice';

import { type AuthenticationProfileData } from './types';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';

interface UseSSOSignInOptions {
  dataErrorKey: string;
  setIsLoading: (isLoading: boolean) => void;
  ssoFunction: () => Promise<AuthenticationProfileData | undefined>;
}

export function useSSOSignIn({
  dataErrorKey,
  setIsLoading,
  ssoFunction,
}: UseSSOSignInOptions) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [signInWithFirebase] = useSignInWithFirebaseMutation();

  const handleError = (error: Error) => {
    processError(error as RTKQueryErrorType, t, {
      onUnmanagedError: message => {
        showErrorToast(t('error.errorTitle'), message);
      },
      onUnexpectedError: () => showUnexpectedErrorToast(t),
    });
  };

  const handleSignIn = async () => {
    setIsLoading(true);

    let ssoData: AuthenticationProfileData | undefined;
    try {
      ssoData = await ssoFunction();
    } catch (error) {
      handleError(error as Error);
      setIsLoading(false);
      return;
    }

    try {
      if (ssoData) {
        const response = await signInWithFirebase(ssoData).unwrap();
        dispatch(login(response));
      } else {
        setIsLoading(false);
        logger().logError(
          Error(`Single sign on data was not provided for ${dataErrorKey}`),
        );
      }
    } catch (error) {
      logger().logError(
        Error(`Firebase sign in error: ${JSON.stringify(error)}`),
      );

      const typedError = error as ResponseError;
      if (
        typedError.data?.field_errors &&
        typedError.data.field_errors.length > 0 &&
        typedError.status === 400
      ) {
        const errors: string[] = [];
        typedError.data?.field_errors?.forEach(fieldError => {
          const errorMessage = asynchErrorMessages(t, fieldError.error);
          if (!errorMessage) return;
          errors.push(`${fieldError.field}: ${errorMessage}`);
        });
        showErrorToast(t('error.errorTitle'), t(dataErrorKey));
        logger().logError(
          new Error(
            `Validation errors for ${ssoData?.email}:\n ${errors.join('\n')}`,
          ),
        );
      } else {
        handleError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn };
}
