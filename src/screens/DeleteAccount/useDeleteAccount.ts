import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { showInfoToast } from '@/components/Toast';
import { deleteAccount, getReauthMethod, signOut } from '@/core/firebase/auth';
import {
  AuthErrorCode,
  getErrorCode,
  getErrorMessageKey,
  logFirebaseError,
  SIGN_IN_CANCELLED,
} from '@/core/firebase/errors';
import { useSessionUser } from '@/core/session/hooks';
import { isAppleCancellation } from '@/core/sso/appleSSO';
import { isGoogleCancellation } from '@/core/sso/googleSSO';

/**
 * Delete account: re-authentication depends on the provider (see `deleteAccount`). Password users
 * are asked for their password only when Firebase requires a recent login. On success Firebase
 * signs the user out and the session returns to Landing.
 */
export const useDeleteAccount = () => {
  const { t } = useTranslation();
  const user = useSessionUser();
  const reauthMethod = user ? getReauthMethod(user) : null;
  const [isDeleting, setIsDeleting] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleDeleteAccount = async (password?: string) => {
    setIsDeleting(true);
    setErrorMessage(undefined);
    try {
      await deleteAccount(password ? { password } : {});
    } catch (error) {
      setIsDeleting(false);
      const code = getErrorCode(error);
      if (
        code === SIGN_IN_CANCELLED ||
        isGoogleCancellation(error) ||
        isAppleCancellation(error)
      ) {
        return;
      }
      if (
        code === AuthErrorCode.RequiresRecentLogin &&
        reauthMethod === 'password'
      ) {
        setNeedsPassword(true);
        return;
      }
      logFirebaseError('deleteAccount', error, user?.uid);
      setErrorMessage(t(getErrorMessageKey(error)));
      return;
    }
    showInfoToast(
      t('deleteAccount.successTitle'),
      t('deleteAccount.successMessage'),
    );
    // Firebase has already signed the user out; this also forgets the Google account.
    signOut().catch(error => logFirebaseError('signOut', error));
  };

  return {
    handleDeleteAccount,
    isDeleting,
    needsPassword,
    errorMessage,
  };
};
