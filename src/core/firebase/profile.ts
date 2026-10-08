import {
  deleteField,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';

import { db } from './app';
import { logFirebaseError } from './errors';
import { type ProviderNames, type UserProfile } from './types';

// Contract: quadev-backend docs/api.md (users/{uid}) and firestore.rules.
const USERS = 'users';
export const NAME_MAX_LENGTH = 30;

const userDoc = (uid: string) => doc(db(), USERS, uid);

// ---------- Dates: strings only, no Date objects or time zones ----------

const DISPLAY_DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** `DD/MM/YYYY` (the form) → `YYYY-MM-DD` (Firestore). Throws on any other format. */
export const displayDateToIso = (value: string): string => {
  const match = DISPLAY_DATE.exec(value.trim());
  if (!match) {
    throw new Error('Invalid date format');
  }
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

/** `YYYY-MM-DD` (Firestore) → `DD/MM/YYYY` (the form). Throws on any other format. */
export const isoDateToDisplay = (value: string): string => {
  const match = ISO_DATE.exec(value.trim());
  if (!match) {
    throw new Error('Invalid date format');
  }
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

// ---------- Names ----------

/** Trims and cuts a provider name to what the rules accept; empty becomes undefined. */
export const normaliseName = (name?: string | null): string | undefined => {
  const trimmed = name?.trim().slice(0, NAME_MAX_LENGTH).trim();
  return trimmed ? trimmed : undefined;
};

// ---------- Reads ----------

const toProfile = (data: Record<string, unknown> | undefined): UserProfile => ({
  firstName: typeof data?.firstName === 'string' ? data.firstName : '',
  lastName: typeof data?.lastName === 'string' ? data.lastName : '',
  ...(typeof data?.dateOfBirth === 'string'
    ? { dateOfBirth: data.dateOfBirth }
    : {}),
});

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
  const snapshot = await getDoc(userDoc(uid));
  return snapshot.exists() ? toProfile(snapshot.data()) : null;
};

/**
 * Listens to `users/{uid}`. `onNext(null)` means the document does not exist on the server.
 * A "missing" answer that only comes from the local cache is skipped (e.g. a new device that
 * has not reached the server yet), so the app does not ask an existing user for their profile.
 */
export const watchProfile = (
  uid: string,
  onNext: (profile: UserProfile | null) => void,
  onError: (error: unknown) => void,
): (() => void) =>
  onSnapshot(
    userDoc(uid),
    { includeMetadataChanges: true },
    snapshot => {
      if (snapshot.exists()) {
        onNext(toProfile(snapshot.data()));
      } else if (!snapshot.metadata.fromCache) {
        onNext(null);
      }
    },
    error => {
      logFirebaseError('watchProfile', error, uid);
      onError(error);
    },
  );

// ---------- Writes ----------

/** Creates `users/{uid}`. `createdAt` is set by the server, as the rules require. */
export const createProfile = async (uid: string, profile: UserProfile) => {
  await setDoc(userDoc(uid), {
    firstName: profile.firstName,
    lastName: profile.lastName,
    ...(profile.dateOfBirth ? { dateOfBirth: profile.dateOfBirth } : {}),
    createdAt: serverTimestamp(),
  });
};

/** Changes names and/or date of birth. `dateOfBirth: null` removes it. */
export const updateProfile = async (
  uid: string,
  changes: Partial<Omit<UserProfile, 'dateOfBirth'>> & {
    dateOfBirth?: string | null;
  },
) => {
  const { dateOfBirth, ...names } = changes;
  await updateDoc(userDoc(uid), {
    ...names,
    ...(dateOfBirth === null ? { dateOfBirth: deleteField() } : {}),
    ...(typeof dateOfBirth === 'string' ? { dateOfBirth } : {}),
  });
};

/** Creates the profile, or completes it if a document already exists. */
export const saveProfile = async (uid: string, profile: UserProfile) => {
  const existing = await getProfile(uid);
  if (existing) {
    await updateProfile(uid, profile);
  } else {
    await createProfile(uid, profile);
  }
};

/**
 * After Google or Apple sign-in: creates the profile from the provider's names when there is
 * none yet. Returns false when the names are incomplete (the user then completes the profile).
 */
export const createProfileIfMissing = async (
  uid: string,
  names: ProviderNames,
): Promise<boolean> => {
  const existing = await getProfile(uid);
  if (existing) {
    return true;
  }
  const firstName = normaliseName(names.firstName);
  const lastName = normaliseName(names.lastName);
  if (!firstName || !lastName) {
    return false;
  }
  await createProfile(uid, { firstName, lastName });
  return true;
};
