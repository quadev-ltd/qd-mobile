// Jest mock for the React Native Firebase v26 modular Auth API.
const auth = { currentUser: null };

export const getAuth = jest.fn(() => auth);
export const signInWithCredential = jest.fn();
export const signOut = jest.fn(() => Promise.resolve());
export const GoogleAuthProvider = { credential: jest.fn() };
export const AppleAuthProvider = { credential: jest.fn() };
