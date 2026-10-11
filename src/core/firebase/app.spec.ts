import { connectAuthEmulator } from '@react-native-firebase/auth';
import { connectFirestoreEmulator } from '@react-native-firebase/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
} from '@react-native-firebase/functions';
import { getRemoteConfig } from '@react-native-firebase/remote-config';

import {
  auth,
  db,
  functions,
  remoteConfig,
  resetEmulatorConnectionForTests,
} from './app';

const mockEnv = { USE_FIREBASE_EMULATORS: false };
// A getter: jest.mock is hoisted above `mockEnv`, and app.ts reads `env` at call time.
jest.mock('@/core/env', () => ({
  get env() {
    return mockEnv;
  },
}));
jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);

describe('Firebase instances', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetEmulatorConnectionForTests();
  });

  it('uses europe-west1 for functions and does not touch the emulators by default', () => {
    mockEnv.USE_FIREBASE_EMULATORS = false;
    auth();
    functions();
    expect(getFunctions).toHaveBeenCalledWith(
      expect.anything(),
      'europe-west1',
    );
    expect(connectAuthEmulator).not.toHaveBeenCalled();
  });

  it('connects Auth, Firestore and Functions to the local emulators once when the flag is set', () => {
    mockEnv.USE_FIREBASE_EMULATORS = true;
    db();
    auth();
    functions();
    expect(connectAuthEmulator).toHaveBeenCalledTimes(1);
    expect(connectAuthEmulator).toHaveBeenCalledWith(
      expect.anything(),
      'http://localhost:9099',
    );
    expect(connectFirestoreEmulator).toHaveBeenCalledWith(
      expect.anything(),
      'localhost',
      8080,
    );
    expect(connectFunctionsEmulator).toHaveBeenCalledWith(
      expect.anything(),
      'localhost',
      5001,
    );
  });

  it('returns Remote Config, except with the emulators (it has none)', () => {
    mockEnv.USE_FIREBASE_EMULATORS = false;
    expect(remoteConfig()).toBe(getRemoteConfig());
    mockEnv.USE_FIREBASE_EMULATORS = true;
    expect(remoteConfig()).toBeNull();
  });
});
