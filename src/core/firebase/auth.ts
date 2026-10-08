import {
  type AuthCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getIdToken,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reload,
  revokeToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from '@react-native-firebase/auth';
import { Platform } from 'react-native';

import { auth } from './app';
import {
  AppAuthError,
  AuthErrorCode,
  getErrorCode,
  logFirebaseError,
  MISSING_PROVIDER_TOKEN,
  NO_CURRENT_USER,
  SIGN_IN_CANCELLED,
} from './errors';
import { createProfile } from './profile';
import {
  APPLE_PROVIDER_ID,
  GOOGLE_PROVIDER_ID,
  PASSWORD_PROVIDER_ID,
  type ProviderNames,
  type ReauthMethod,
  type SessionUser,
  type UserProfile,
} from './types';

import { type AppleIdentity, requestAppleIdentity } from '@/core/sso/appleSSO';
import { requestGoogleIdentity, signOutFromGoogle } from '@/core/sso/googleSSO';

export interface SSOSignInResult {
  user: SessionUser;
  names: ProviderNames;
}

// ---------- Session ----------

export const toSessionUser = (user: User): SessionUser => ({
  uid: user.uid,
  email: user.email,
  emailVerified: user.emailVerified,
  displayName: user.displayName,
  providerIds: (user.providerData ?? []).map(info => info.providerId),
});

/** Calls `listener` now and on every sign-in / sign-out. Returns the unsubscribe function. */
export const subscribeToAuthState = (
  listener: (user: SessionUser | null) => void,
): (() => void) =>
  onAuthStateChanged(auth(), user =>
    listener(user ? toSessionUser(user) : null),
  );

export const getCurrentSessionUser = (): SessionUser | null => {
  const user = auth().currentUser;
  return user ? toSessionUser(user) : null;
};

const requireCurrentUser = (): User => {
  const user = auth().currentUser;
  if (!user) {
    throw new AppAuthError(NO_CURRENT_USER);
  }
  return user;
};

// ---------- Email and password ----------

/**
 * Creates the account, writes the profile and sends the verification email. The account is the
 * only step that must succeed: a failed profile write is completed later on CompleteProfile, and
 * the email can be resent from VerifyEmail.
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  profile: UserProfile,
): Promise<SessionUser> => {
  const { user } = await createUserWithEmailAndPassword(
    auth(),
    email,
    password,
  );
  try {
    await createProfile(user.uid, profile);
  } catch (error) {
    logFirebaseError('createProfile', error, user.uid);
  }
  try {
    await sendEmailVerification(user);
  } catch (error) {
    logFirebaseError('sendEmailVerification', error, user.uid);
  }
  return toSessionUser(user);
};

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<SessionUser> => {
  const { user } = await signInWithEmailAndPassword(auth(), email, password);
  return toSessionUser(user);
};

export const sendVerificationEmail = async () => {
  await sendEmailVerification(requireCurrentUser());
};

/**
 * Reloads the user (to see `emailVerified` after the hosted verification page) and forces a new
 * ID token, so Firestore rules and custom claims see the change. Returns the updated user.
 */
export const refreshUser = async (): Promise<SessionUser | null> => {
  const user = requireCurrentUser();
  await reload(user);
  await getIdToken(auth().currentUser ?? user, true);
  return getCurrentSessionUser();
};

/**
 * With email enumeration protection on, this resolves even when no account exists, so the UI
 * always shows the same neutral message.
 */
export const sendPasswordReset = async (email: string) => {
  await sendPasswordResetEmail(auth(), email);
};

// ---------- Google and Apple ----------

const appleCredential = (identity: AppleIdentity): AuthCredential => {
  if (!identity.identityToken) {
    throw new AppAuthError(MISSING_PROVIDER_TOKEN);
  }
  const { firstName, lastName } = identity.names;
  return new OAuthProvider(APPLE_PROVIDER_ID).credential({
    idToken: identity.identityToken,
    rawNonce: identity.nonce,
    ...(firstName || lastName
      ? { fullName: { givenName: firstName, familyName: lastName } }
      : {}),
  });
};

/** Resolves `null` when the user closes the Google account picker. */
export const signInWithGoogle = async (): Promise<SSOSignInResult | null> => {
  const identity = await requestGoogleIdentity();
  if (!identity) {
    return null;
  }
  if (!identity.idToken) {
    throw new AppAuthError(MISSING_PROVIDER_TOKEN);
  }
  const { user } = await signInWithCredential(
    auth(),
    GoogleAuthProvider.credential(identity.idToken),
  );
  return { user: toSessionUser(user), names: identity.names };
};

export const signInWithApple = async (): Promise<SSOSignInResult> => {
  const identity = await requestAppleIdentity();
  const { user } = await signInWithCredential(
    auth(),
    appleCredential(identity),
  );
  return { user: toSessionUser(user), names: identity.names };
};

// ---------- Sign out and delete ----------

/** Safe to call when already signed out (RNFB rejects signOut without a current user). */
export const signOut = async () => {
  if (auth().currentUser) {
    await firebaseSignOut(auth());
  }
  await signOutFromGoogle();
};

/**
 * How the user proves who they are before deleting the account. Apple re-auth is iOS only
 * (the Apple button is hidden on Android); `null` means no re-auth is possible here.
 */
export const getReauthMethod = (
  user: SessionUser,
  platform: string = Platform.OS,
): ReauthMethod | null => {
  if (user.providerIds.includes(APPLE_PROVIDER_ID) && platform === 'ios') {
    return 'apple';
  }
  if (user.providerIds.includes(GOOGLE_PROVIDER_ID)) {
    return 'google';
  }
  if (user.providerIds.includes(PASSWORD_PROVIDER_ID)) {
    return 'password';
  }
  return null;
};

const reauthenticateWithGoogle = async (user: User) => {
  const identity = await requestGoogleIdentity();
  if (!identity) {
    throw new AppAuthError(SIGN_IN_CANCELLED);
  }
  if (!identity.idToken) {
    throw new AppAuthError(MISSING_PROVIDER_TOKEN);
  }
  await reauthenticateWithCredential(
    user,
    GoogleAuthProvider.credential(identity.idToken),
  );
};

/**
 * Deletes the Firebase account. The backend's `onUserDeleted` then deletes `users/{uid}`, and
 * Firebase signs the user out.
 * - Apple (iOS): always re-authenticates with Apple first, to get a fresh authorization code,
 *   and revokes the Apple token (App Store rule, D17). Revocation errors are logged, not fatal:
 *   it does nothing until the Apple key is added in the Firebase console.
 * - Google: tries to delete; if Firebase asks for a recent login, re-authenticates with Google
 *   and tries again.
 * - Password: tries to delete; on `auth/requires-recent-login` the error is passed to the caller,
 *   which asks for the password and calls again with it.
 */
export const deleteAccount = async (
  options: { password?: string } = {},
): Promise<void> => {
  const user = requireCurrentUser();
  const uid = user.uid;
  const method = getReauthMethod(toSessionUser(user));

  if (method === 'apple') {
    const identity = await requestAppleIdentity();
    await reauthenticateWithCredential(user, appleCredential(identity));
    if (identity.authorizationCode) {
      try {
        await revokeToken(auth(), identity.authorizationCode);
      } catch (error) {
        logFirebaseError('revokeToken', error, uid);
      }
    }
    await deleteUser(user);
    return;
  }

  if (method === 'password' && options.password) {
    await reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email ?? '', options.password),
    );
    await deleteUser(user);
    return;
  }

  try {
    await deleteUser(user);
  } catch (error) {
    if (
      method !== 'google' ||
      getErrorCode(error) !== AuthErrorCode.RequiresRecentLogin
    ) {
      throw error;
    }
    await reauthenticateWithGoogle(user);
    await deleteUser(user);
  }
  if (method === 'google') {
    await signOutFromGoogle();
  }
};
