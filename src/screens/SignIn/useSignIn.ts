import { useState } from 'react';
import { type UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { showErrorToast } from '@/components/Toast';
import { signInWithEmail } from '@/core/firebase/auth';
import {
  AuthErrorCode,
  getErrorCode,
  getErrorMessageKey,
  logFirebaseError,
} from '@/core/firebase/errors';
import { SignInFields, type SignInSchemaType } from '@/schemas/signInSchema';

// With email enumeration protection, a wrong email and a wrong password both give
// auth/invalid-credential; the older codes are kept for the emulator and older projects.
const CREDENTIAL_ERRORS: string[] = [
  AuthErrorCode.InvalidCredential,
  AuthErrorCode.WrongPassword,
  AuthErrorCode.UserNotFound,
  AuthErrorCode.InvalidEmail,
];

/**
 * Signs in with email and password. The session then shows VerifyEmail, CompleteProfile or Home.
 */
export const useSignIn = (setError: UseFormSetError<SignInSchemaType>) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (formData: SignInSchemaType) => {
    setIsLoading(true);
    try {
      await signInWithEmail(
        formData[SignInFields.email].trim().toLowerCase(),
        formData[SignInFields.password],
      );
    } catch (error) {
      logFirebaseError('signIn', error);
      setIsLoading(false);
      const message = t(getErrorMessageKey(error));
      if (CREDENTIAL_ERRORS.includes(getErrorCode(error) ?? '')) {
        setError(
          SignInFields.email,
          { type: 'manual', message },
          { shouldFocus: true },
        );
      } else {
        showErrorToast(t('error.errorTitle'), message);
      }
    }
  };

  return { signIn, isLoading };
};
