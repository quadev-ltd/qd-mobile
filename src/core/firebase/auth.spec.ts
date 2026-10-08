import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getIdToken,
  GoogleAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  reload,
  revokeToken,
  sendEmailVerification,
  signOut as firebaseSignOut,
  signInWithCredential,
} from '@react-native-firebase/auth';
import { setDoc } from '@react-native-firebase/firestore';

import {
  deleteAccount,
  getReauthMethod,
  refreshUser,
  signInWithApple,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
  toSessionUser,
} from './auth';
import { type SessionUser } from './types';

import { requestAppleIdentity } from '@/core/sso/appleSSO';
import { requestGoogleIdentity, signOutFromGoogle } from '@/core/sso/googleSSO';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/sso/googleSSO', () => ({
  requestGoogleIdentity: jest.fn(),
  signOutFromGoogle: jest.fn(() => Promise.resolve()),
}));
jest.mock('@/core/sso/appleSSO', () => ({
  requestAppleIdentity: jest.fn(),
}));

// The mock returns one mutable auth object (__mocks__/@react-native-firebase/auth.ts).
const mockAuth = getAuth();
const authState = mockAuth as unknown as { currentUser: unknown };

const fakeUser = (providerIds: string[], overrides: object = {}) => ({
  uid: 'uid-1',
  email: 'ada@example.com',
  emailVerified: false,
  displayName: null,
  providerData: providerIds.map(providerId => ({ providerId })),
  ...overrides,
});

const sessionUser = (providerIds: string[]): SessionUser => ({
  uid: 'uid-1',
  email: null,
  emailVerified: false,
  displayName: null,
  providerIds,
});

const recentLoginError = Object.assign(new Error('recent'), {
  code: 'auth/requires-recent-login',
});

beforeEach(() => {
  jest.clearAllMocks();
  authState.currentUser = null;
});

describe('toSessionUser', () => {
  it('keeps only plain fields', () => {
    expect(toSessionUser(fakeUser(['password']) as never)).toEqual({
      uid: 'uid-1',
      email: 'ada@example.com',
      emailVerified: false,
      displayName: null,
      providerIds: ['password'],
    });
  });
});

describe('signUpWithEmail', () => {
  it('creates the account, then the profile, then sends the verification email', async () => {
    const user = fakeUser(['password']);
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user });
    await signUpWithEmail('ada@example.com', 'Secret1!', {
      firstName: 'Ada',
      lastName: 'L',
    });
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      'ada@example.com',
      'Secret1!',
    );
    expect(setDoc).toHaveBeenCalled();
    expect(sendEmailVerification).toHaveBeenCalledWith(user);
  });

  it('still sends the email when the profile write fails (CompleteProfile recovers it)', async () => {
    const user = fakeUser(['password']);
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({ user });
    (setDoc as jest.Mock).mockRejectedValueOnce({
      code: 'firestore/permission-denied',
    });
    await expect(
      signUpWithEmail('ada@example.com', 'Secret1!', {
        firstName: 'Ada',
        lastName: 'L',
      }),
    ).resolves.toMatchObject({ uid: 'uid-1' });
    expect(sendEmailVerification).toHaveBeenCalled();
  });

  it('fails when the account cannot be created', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
      code: 'auth/email-already-in-use',
    });
    await expect(
      signUpWithEmail('ada@example.com', 'Secret1!', {
        firstName: 'Ada',
        lastName: 'L',
      }),
    ).rejects.toEqual({ code: 'auth/email-already-in-use' });
    expect(setDoc).not.toHaveBeenCalled();
  });
});

describe('refreshUser', () => {
  it('reloads the user and forces a new ID token', async () => {
    const user = fakeUser(['password']);
    authState.currentUser = user;
    (reload as jest.Mock).mockImplementation(async () => {
      authState.currentUser = { ...user, emailVerified: true };
    });
    const result = await refreshUser();
    expect(reload).toHaveBeenCalledWith(user);
    expect(getIdToken).toHaveBeenCalledWith(
      expect.objectContaining({ emailVerified: true }),
      true,
    );
    expect(result?.emailVerified).toBe(true);
  });

  it('fails without a signed-in user', async () => {
    await expect(refreshUser()).rejects.toMatchObject({
      code: 'app/no-current-user',
    });
  });
});

describe('Google and Apple sign-in', () => {
  it('returns null when the Google picker is cancelled', async () => {
    (requestGoogleIdentity as jest.Mock).mockResolvedValue(null);
    await expect(signInWithGoogle()).resolves.toBeNull();
    expect(signInWithCredential).not.toHaveBeenCalled();
  });

  it('signs in to Firebase with the Google ID token and returns the names', async () => {
    (requestGoogleIdentity as jest.Mock).mockResolvedValue({
      idToken: 'google-token',
      names: { firstName: 'Ada', lastName: 'L' },
    });
    (signInWithCredential as jest.Mock).mockResolvedValue({
      user: fakeUser(['google.com'], { emailVerified: true }),
    });
    const result = await signInWithGoogle();
    expect(GoogleAuthProvider.credential).toHaveBeenCalledWith('google-token');
    expect(result?.names).toEqual({ firstName: 'Ada', lastName: 'L' });
    expect(result?.user.providerIds).toEqual(['google.com']);
  });

  it('uses OAuthProvider("apple.com") with the raw nonce for Apple', async () => {
    (requestAppleIdentity as jest.Mock).mockResolvedValue({
      identityToken: 'apple-token',
      nonce: 'raw-nonce',
      authorizationCode: 'code',
      names: {},
    });
    (signInWithCredential as jest.Mock).mockResolvedValue({
      user: fakeUser(['apple.com']),
    });
    await signInWithApple();
    expect((signInWithCredential as jest.Mock).mock.calls[0][1]).toEqual({
      providerId: 'apple.com',
      idToken: 'apple-token',
      rawNonce: 'raw-nonce',
    });
  });

  it('rejects an Apple response without an identity token', async () => {
    (requestAppleIdentity as jest.Mock).mockResolvedValue({
      identityToken: null,
      nonce: 'n',
      authorizationCode: null,
      names: {},
    });
    await expect(signInWithApple()).rejects.toMatchObject({
      code: 'app/missing-provider-token',
    });
  });
});

describe('signOut', () => {
  it('signs out of Firebase and Google', async () => {
    authState.currentUser = fakeUser(['google.com']);
    await signOut();
    expect(firebaseSignOut).toHaveBeenCalledWith(mockAuth);
    expect(signOutFromGoogle).toHaveBeenCalled();
  });

  it('does not fail when already signed out (e.g. right after deleting the account)', async () => {
    await expect(signOut()).resolves.toBeUndefined();
    expect(firebaseSignOut).not.toHaveBeenCalled();
    expect(signOutFromGoogle).toHaveBeenCalled();
  });
});

describe('getReauthMethod', () => {
  it.each([
    [['password'], 'ios', 'password'],
    [['google.com'], 'android', 'google'],
    [['password', 'google.com'], 'android', 'google'],
    [['apple.com'], 'ios', 'apple'],
    [['apple.com'], 'android', null],
    [['apple.com', 'password'], 'android', 'password'],
  ])('%j on %s -> %s', (providers, platform, expected) => {
    expect(getReauthMethod(sessionUser(providers), platform)).toBe(expected);
  });
});

describe('deleteAccount', () => {
  it('password user: deletes directly when the login is recent', async () => {
    authState.currentUser = fakeUser(['password']);
    await deleteAccount();
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(reauthenticateWithCredential).not.toHaveBeenCalled();
  });

  it('password user: passes requires-recent-login to the caller', async () => {
    authState.currentUser = fakeUser(['password']);
    (deleteUser as jest.Mock).mockRejectedValueOnce(recentLoginError);
    await expect(deleteAccount()).rejects.toBe(recentLoginError);
  });

  it('password user: re-authenticates with the password, then deletes', async () => {
    const user = fakeUser(['password']);
    authState.currentUser = user;
    await deleteAccount({ password: 'Secret1!' });
    expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
      'ada@example.com',
      'Secret1!',
    );
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      user,
      expect.objectContaining({ providerId: 'password' }),
    );
    expect(deleteUser).toHaveBeenCalledWith(user);
  });

  it('Google user: re-authenticates with Google after requires-recent-login, then deletes', async () => {
    authState.currentUser = fakeUser(['google.com']);
    (deleteUser as jest.Mock).mockRejectedValueOnce(recentLoginError);
    (requestGoogleIdentity as jest.Mock).mockResolvedValue({
      idToken: 'google-token',
      names: {},
    });
    await deleteAccount();
    expect(reauthenticateWithCredential).toHaveBeenCalledWith(
      authState.currentUser,
      expect.objectContaining({ providerId: 'google.com' }),
    );
    expect(deleteUser).toHaveBeenCalledTimes(2);
    expect(signOutFromGoogle).toHaveBeenCalled();
  });

  it('Google user: stops when the re-auth picker is cancelled', async () => {
    authState.currentUser = fakeUser(['google.com']);
    (deleteUser as jest.Mock).mockRejectedValueOnce(recentLoginError);
    (requestGoogleIdentity as jest.Mock).mockResolvedValue(null);
    await expect(deleteAccount()).rejects.toMatchObject({
      code: 'app/sign-in-cancelled',
    });
    expect(deleteUser).toHaveBeenCalledTimes(1);
  });

  it('Apple user (iOS): re-authenticates, revokes the Apple token, then deletes (D17)', async () => {
    authState.currentUser = fakeUser(['apple.com']);
    (requestAppleIdentity as jest.Mock).mockResolvedValue({
      identityToken: 'apple-token',
      nonce: 'raw-nonce',
      authorizationCode: 'auth-code',
      names: {},
    });
    await deleteAccount();
    expect(reauthenticateWithCredential).toHaveBeenCalled();
    expect(revokeToken).toHaveBeenCalledWith(mockAuth, 'auth-code');
    expect(deleteUser).toHaveBeenCalledTimes(1);
    const order = [
      (reauthenticateWithCredential as jest.Mock).mock.invocationCallOrder[0],
      (revokeToken as jest.Mock).mock.invocationCallOrder[0],
      (deleteUser as jest.Mock).mock.invocationCallOrder[0],
    ];
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('Apple user: a failed revocation does not block the deletion', async () => {
    authState.currentUser = fakeUser(['apple.com']);
    (requestAppleIdentity as jest.Mock).mockResolvedValue({
      identityToken: 'apple-token',
      nonce: 'raw-nonce',
      authorizationCode: 'auth-code',
      names: {},
    });
    (revokeToken as jest.Mock).mockRejectedValueOnce({
      code: 'auth/invalid-credential',
    });
    await deleteAccount();
    expect(deleteUser).toHaveBeenCalledTimes(1);
  });

  it('fails without a signed-in user', async () => {
    await expect(deleteAccount()).rejects.toMatchObject({
      code: 'app/no-current-user',
    });
  });
});
