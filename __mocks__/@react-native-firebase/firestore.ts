// Jest mock for the React Native Firebase v26 modular Firestore API.
const mockDb = { app: 'mock-app' };

export const getFirestore = jest.fn(() => mockDb);
export const connectFirestoreEmulator = jest.fn();
export const doc = jest.fn((_db: unknown, ...segments: string[]) => ({
  path: segments.join('/'),
}));
export const getDoc = jest.fn();
export const setDoc = jest.fn(() => Promise.resolve());
export const updateDoc = jest.fn(() => Promise.resolve());
export const onSnapshot = jest.fn(() => jest.fn());
export const serverTimestamp = jest.fn(() => 'SERVER_TIMESTAMP');
export const deleteField = jest.fn(() => 'DELETE_FIELD');
