import { useTranslation } from 'react-i18next';

import { isAppleCancellation } from './appleSSO';
import { isGoogleCancellation } from './googleSSO';

import { showErrorToast } from '@/components/Toast';
import { type SSOSignInResult } from '@/core/firebase/auth';
import { getErrorMessageKey, logFirebaseError } from '@/core/firebase/errors';
import { createProfileIfMissing } from '@/core/firebase/profile';
import { useAppDispatch } from '@/core/state/hooks';
import {
  profileSetupFinished,
  profileSetupStarted,
  providerNamesReceived,
} from '@/core/state/slices/sessionSlice';

interface UseSSOSignInOptions {
  provider: 'google' | 'apple';
  setIsLoading: (isLoading: boolean) => void;
  /** Resolves `null` when the user cancels. */
  signIn: () => Promise<SSOSignInResult | null>;
}

const isCancellation = (error: unknown) =>
  isGoogleCancellation(error) || isAppleCancellation(error);

/**
 * Google / Apple sign-in. A new user gets a profile from the provider's names (no date of
 * birth). When the names are missing (Apple shares them only once), the session shows
 * CompleteProfile, prefilled with whatever the provider sent.
 */
export function useSSOSignIn({
  provider,
  setIsLoading,
  signIn,
}: UseSSOSignInOptions) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleSignIn = async () => {
    setIsLoading(true);
    // Holds the session on the loading screen until the profile exists, so CompleteProfile
    // does not flash for a new user.
    dispatch(profileSetupStarted());
    let uid: string | undefined;
    try {
      const result = await signIn();
      if (!result) {
        return;
      }
      uid = result.user.uid;
      dispatch(providerNamesReceived(result.names));
      await createProfileIfMissing(uid, result.names);
    } catch (error) {
      if (isCancellation(error)) {
        return;
      }
      logFirebaseError(`${provider}SignIn`, error, uid);
      // Signed in but the profile write failed: CompleteProfile takes over, no toast needed.
      if (!uid) {
        showErrorToast(t('error.errorTitle'), t(getErrorMessageKey(error)));
      }
    } finally {
      dispatch(profileSetupFinished());
      setIsLoading(false);
    }
  };

  return { handleSignIn };
}
