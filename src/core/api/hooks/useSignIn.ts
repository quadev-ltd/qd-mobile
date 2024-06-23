import { type UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSignInMutation } from '..';
import {
  asynchErrorMessages,
  type RTKQueryErrorType,
  processError,
} from '../errors';
import { FieldErrors, type ResponseError } from '../types';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import logger from '@/core/logger';
import { useAppDispatch } from '@/core/state/hooks';
import { type TokensPayload, login } from '@/core/state/slices/authSlice';
import { SignInFields, type SignInSchemaType } from '@/schemas/signInSchema';
import { trimFormData } from '@/util';

export const useSignIn = (
  setAsynchError: UseFormSetError<SignInSchemaType>,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [signInUser, { isLoading, isSuccess }] = useSignInMutation();
  const handleLoginSuccess = (authenticationTokens: TokensPayload) => {
    try {
      dispatch(
        login({
          authToken: authenticationTokens.authToken,
          refreshToken: authenticationTokens.refreshToken,
        }),
      );
    } catch (err) {
      logger().logError(Error(`Failed to decode JWT: ${err}`));
      showUnexpectedErrorToast(t);
    }
  };

  const signIn = async (formData: SignInSchemaType) => {
    try {
      const trimmedFormData = trimFormData(formData);
      trimmedFormData.email = trimmedFormData.email.toLowerCase();
      const userData = await signInUser(trimmedFormData).unwrap();
      handleLoginSuccess(userData);
    } catch (err) {
      const typedError = err as ResponseError;
      if (
        typedError.data?.error &&
        (typedError.data.error as string).includes(
          FieldErrors.InvalidEmailPassword,
        ) &&
        typedError.status === 401
      ) {
        const errorMessage = asynchErrorMessages(
          t,
          FieldErrors.InvalidEmailPassword,
        );
        setAsynchError(
          SignInFields.email,
          {
            type: 'manual',
            message: errorMessage,
          },
          { shouldFocus: true },
        );
      } else {
        processError(err as RTKQueryErrorType, t, {
          onUnmanagedError: message => {
            showErrorToast(t('error.errorTitle'), message);
          },
          onUnexpectedError: () => showUnexpectedErrorToast(t),
          logErrorMessage: `Unknown error while signing in for ${
            formData[SignInFields.email]
          }: ${JSON.stringify(err)}`,
        });
      }
    }
  };
  return { signIn, isLoading, isSuccess };
};
