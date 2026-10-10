import { doc, onSnapshot } from '@react-native-firebase/firestore';

import { db } from './app';

import { parseOverrides } from '@/core/flags/evaluate';
import {
  FEATURE_FLAGS_COLLECTION,
  type FlagValues,
} from '@/core/flags/registry';

// Contract: quadev-backend docs/api.md (featureFlags/{uid}) and firestore.rules: the owner can read
// it, no client can write it (scripts/set-flag.ts writes it with the Admin SDK).

/**
 * Listens to the user's flag overrides in `featureFlags/{uid}`. A missing document means no
 * overrides (`onNext({})`). Errors (e.g. permission denied) are passed to `onError`; the listener
 * stops after an error, as Firestore listeners do.
 */
export const watchFlagOverrides = (
  uid: string,
  onNext: (overrides: FlagValues) => void,
  onError: (error: unknown) => void,
): (() => void) =>
  onSnapshot(
    doc(db(), FEATURE_FLAGS_COLLECTION, uid),
    snapshot => {
      onNext(snapshot.exists() ? parseOverrides(snapshot.data()) : {});
    },
    error => onError(error),
  );
