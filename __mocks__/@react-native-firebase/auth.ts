// Jest mock for the React Native Firebase v26 modular Auth API.
// Tests set `mockAuth.currentUser` and the resolved values of the functions they need.
export const mockAuth: { currentUser: unknown } = { currentUser: null };

export const getAuth = jest.fn(() => mockAuth);
export const connectAuthEmulator = jest.fn();
export const onAuthStateChanged = jest.fn(() => jest.fn());
export const onIdTokenChanged = jest.fn(() => jest.fn());
export const createUserWithEmailAndPassword = jest.fn();
export const signInWithEmailAndPassword = jest.fn();
export const signInWithCredential = jest.fn();
export const sendEmailVerification = jest.fn(() => Promise.resolve());
export const sendPasswordResetEmail = jest.fn(() => Promise.resolve());
export const reload = jest.fn(() => Promise.resolve());
export const getIdToken = jest.fn(() => Promise.resolve('id-token'));
export const getIdTokenResult = jest.fn(() => Promise.resolve({ claims: {} }));
export const reauthenticateWithCredential = jest.fn(() => Promise.resolve());
export const deleteUser = jest.fn(() => Promise.resolve());
export const revokeToken = jest.fn(() => Promise.resolve());
export const signOut = jest.fn(() => Promise.resolve());
export const validatePassword = jest.fn();

export const GoogleAuthProvider = {
  credential: jest.fn((idToken: string) => ({
    providerId: 'google.com',
    token: idToken,
  })),
};
export const EmailAuthProvider = {
  credential: jest.fn((email: string, password: string) => ({
    providerId: 'password',
    token: email,
    secret: password,
  })),
};
export const AppleAuthProvider = { credential: jest.fn() };
export const OAuthProvider = jest
  .fn()
  .mockImplementation((providerId: string) => ({
    providerId,
    credential: jest.fn((options: object) => ({ providerId, ...options })),
  }));
