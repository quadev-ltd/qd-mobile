import {
  GoogleSignin,
  isCancelledResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { env } from '../env';

import { type ProviderNames } from '@/core/firebase/types';

GoogleSignin.configure({
  webClientId: env.CLIENT_ID,
  offlineAccess: true,
});

export interface GoogleIdentity {
  idToken: string | null;
  names: ProviderNames;
}

/**
 * Shows the Google account picker. Resolves `null` when the user cancels.
 * Throws when Play Services are missing or the sign-in fails (errors carry a `code`).
 */
export const requestGoogleIdentity =
  async (): Promise<GoogleIdentity | null> => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (isCancelledResponse(response)) {
      return null;
    }
    const { idToken, user } = response.data;
    return {
      idToken,
      names: {
        firstName: user.givenName ?? undefined,
        lastName: user.familyName ?? undefined,
      },
    };
  };

/** Forgets the Google account so the picker shows again next time. Never throws. */
export const signOutFromGoogle = async () => {
  try {
    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }
  } catch {
    // Nothing to do: the Firebase session is what matters, and it is signed out separately.
  }
};

/** The user closed the picker, or a sign-in is already running: nothing to report. */
export const isGoogleCancellation = (error: unknown) => {
  const code = (error as { code?: unknown })?.code;
  return (
    code === statusCodes.SIGN_IN_CANCELLED || code === statusCodes.IN_PROGRESS
  );
};
