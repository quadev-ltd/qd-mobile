import { getApp } from '@react-native-firebase/app';
import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
} from '@react-native-firebase/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
} from '@react-native-firebase/functions';
import {
  getRemoteConfig,
  type RemoteConfig,
} from '@react-native-firebase/remote-config';

import { env } from '@/core/env';
import logger from '@/core/logger';

/** Region of the `accounts` functions codebase (quadev-backend). */
export const FUNCTIONS_REGION = 'europe-west1';

// Ports from quadev-backend/firebase.json. RNFB maps "localhost" to 10.0.2.2 on Android emulators.
const EMULATOR_HOST = 'localhost';
const AUTH_EMULATOR_PORT = 9099;
const FIRESTORE_EMULATOR_PORT = 8080;
const FUNCTIONS_EMULATOR_PORT = 5001;

let emulatorsConnected = false;

// Must run before the first Auth, Firestore or Functions call, so every getter goes through it.
const connectEmulatorsOnce = () => {
  if (emulatorsConnected || !env.USE_FIREBASE_EMULATORS) {
    return;
  }
  emulatorsConnected = true;
  connectAuthEmulator(
    getAuth(),
    `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`,
  );
  connectFirestoreEmulator(
    getFirestore(),
    EMULATOR_HOST,
    FIRESTORE_EMULATOR_PORT,
  );
  connectFunctionsEmulator(
    getFunctions(getApp(), FUNCTIONS_REGION),
    EMULATOR_HOST,
    FUNCTIONS_EMULATOR_PORT,
  );
  logger().logMessage('Using the local Firebase emulators.');
};

export const auth = () => {
  connectEmulatorsOnce();
  return getAuth();
};

export const db = () => {
  connectEmulatorsOnce();
  return getFirestore();
};

export const functions = () => {
  connectEmulatorsOnce();
  return getFunctions(getApp(), FUNCTIONS_REGION);
};

/**
 * Remote Config, or null with the emulators: Remote Config has no emulator, and end-to-end runs must
 * not depend on the real project's values (flags then come from Firestore overrides and defaults).
 */
export const remoteConfig = (): RemoteConfig | null =>
  env.USE_FIREBASE_EMULATORS ? null : getRemoteConfig();

/** Test helper: lets a test reconnect after changing the environment. */
export const resetEmulatorConnectionForTests = () => {
  emulatorsConnected = false;
};
