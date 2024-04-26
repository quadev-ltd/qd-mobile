import { type UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSignInMutation } from '..';
import { AsynchErrorMessages } from '../constants';
import { FieldErrors, type ResponseError, type SignInResponse } from '../types';

import { showUnexpectedErrorToast } from '@/components/Toast';
import logger from '@/core/logger';
import { SignInFields, type SignInSchemaType } from '@/schemas/signInSchema';
import { trimFormData } from '@/util';

export const useSignIn = (
  onSuccess: (userData: SignInResponse) => void,
  setAsynchError: UseFormSetError<SignInSchemaType>,
) => {
  const { t } = useTranslation();
  const [signInUser, { isLoading }] = useSignInMutation();

  const signIn = async (formData: SignInSchemaType) => {
    try {
      const trimmedFormData = trimFormData(formData);
      trimmedFormData.email = trimmedFormData.email.toLowerCase();
      const userData = await signInUser(trimmedFormData).unwrap();
      onSuccess(userData);
    } catch (err) {
      const typedError = err as ResponseError;
      if (
        typedError.data?.error &&
        (typedError.data.error as string).includes(
          FieldErrors.InvalidEmailPassword,
        ) &&
        typedError.status === 401
      ) {
        const errorMessage = AsynchErrorMessages(
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
        logger().logError(
          Error(
            `Unknown sign in error for email ${
              formData[SignInFields.email]
            }: ${JSON.stringify(err)}`,
          ),
        );
        showUnexpectedErrorToast(t);
      }
    }
  };
  return { signIn, isLoading };
};
