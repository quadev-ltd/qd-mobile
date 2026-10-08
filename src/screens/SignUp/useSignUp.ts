import { useState } from 'react';
import { type UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { showErrorToast } from '@/components/Toast';
import { signUpWithEmail } from '@/core/firebase/auth';
import {
  AuthErrorCode,
  getErrorCode,
  getErrorMessageKey,
  logFirebaseError,
} from '@/core/firebase/errors';
import { displayDateToIso } from '@/core/firebase/profile';
import { SignUpFields, type SignUpSchemaType } from '@/schemas/signUpSchema';

const EMAIL_ERRORS: string[] = [
  AuthErrorCode.EmailAlreadyInUse,
  AuthErrorCode.InvalidEmail,
];
const PASSWORD_ERRORS: string[] = [
  AuthErrorCode.PasswordDoesNotMeetRequirements,
  AuthErrorCode.WeakPassword,
];

/**
 * Creates the account, profile and verification email. On success there is nothing to do here:
 * the session moves to VerifyEmail by itself.
 */
export const useSignUp = (setError: UseFormSetError<SignUpSchemaType>) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const signUp = async (formData: SignUpSchemaType) => {
    setIsLoading(true);
    const dateOfBirth = formData[SignUpFields.dob]?.trim();
    try {
      await signUpWithEmail(
        formData[SignUpFields.email].trim().toLowerCase(),
        formData[SignUpFields.password],
        {
          firstName: formData[SignUpFields.firstName].trim(),
          lastName: formData[SignUpFields.lastName].trim(),
          ...(dateOfBirth
            ? { dateOfBirth: displayDateToIso(dateOfBirth) }
            : {}),
        },
      );
    } catch (error) {
      logFirebaseError('signUp', error);
      setIsLoading(false);
      const code = getErrorCode(error) ?? '';
      const message = t(getErrorMessageKey(error));
      if (EMAIL_ERRORS.includes(code)) {
        setError(
          SignUpFields.email,
          { type: 'manual', message },
          { shouldFocus: true },
        );
      } else if (PASSWORD_ERRORS.includes(code)) {
        setError(
          SignUpFields.password,
          { type: 'manual', message },
          { shouldFocus: true },
        );
      } else {
        showErrorToast(t('error.errorTitle'), message);
      }
    }
  };

  return { signUp, isLoading };
};
