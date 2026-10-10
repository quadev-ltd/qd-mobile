import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { evaluateAll } from './evaluate';
import { DEFAULT_FLAGS, type EvaluatedFlags, type FlagKey } from './registry';

import { env } from '@/core/env';
import { getErrorCode, logFirebaseError } from '@/core/firebase/errors';
import { watchFlagOverrides } from '@/core/firebase/featureFlags';
import { startRemoteConfig } from '@/core/firebase/remoteConfig';
import logger from '@/core/logger';
import { useSessionUser } from '@/core/session/hooks';

/** Without a provider (e.g. in a test), every flag has its code default. */
const FlagsContext = createContext<EvaluatedFlags>(DEFAULT_FLAGS);

/** Production fetches at most once an hour (real-time updates still arrive); dev/test always fetch. */
const ONE_HOUR = 60 * 60 * 1000;
const minimumFetchIntervalMillis = () =>
  env.APPLICATION_ENVIRONMENT === 'prod' ? ONE_HOUR : 0;

const NO_OVERRIDES: Partial<EvaluatedFlags> = {};

const isPermissionDenied = (error: unknown) => {
  const code = getErrorCode(error);
  return code === 'firestore/permission-denied' || code === 'permission-denied';
};

/**
 * Evaluates the feature flags (D18): the signed-in user's overrides in `featureFlags/{uid}` (live),
 * then Remote Config (fetched at start and updated in real time), then the code defaults. Any
 * failure falls back to the next layer, so the app never waits for flags or breaks without them.
 * Mount it inside the Redux Provider (it reads the session user).
 */
export const FlagsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const uid = useSessionUser()?.uid ?? null;
  const [overrides, setOverrides] = useState<{
    uid: string | null;
    values: Partial<EvaluatedFlags>;
  }>({ uid: null, values: NO_OVERRIDES });
  const [remote, setRemote] = useState<Partial<EvaluatedFlags>>({});

  // Remote Config: once per app start, whoever is signed in.
  useEffect(
    () =>
      startRemoteConfig(setRemote, {
        minimumFetchIntervalMillis: minimumFetchIntervalMillis(),
      }),
    [],
  );

  // Per-user overrides: one listener per signed-in user, none when signed out.
  useEffect(() => {
    if (!uid) {
      return undefined;
    }
    let active = true;
    let stop: (() => void) | undefined;
    const fallBack = () => {
      if (active) {
        setOverrides({ uid, values: NO_OVERRIDES });
      }
    };
    try {
      stop = watchFlagOverrides(
        uid,
        values => {
          if (active) {
            setOverrides({ uid, values });
          }
        },
        error => {
          // Expected until the featureFlags rules are deployed, and after sign-out; not a crash.
          if (isPermissionDenied(error)) {
            logger().logMessage(
              `watchFlagOverrides denied: uid=${uid}; using Remote Config and defaults`,
            );
          } else {
            logFirebaseError('watchFlagOverrides', error, uid);
          }
          fallBack();
        },
      );
    } catch (error) {
      logFirebaseError('watchFlagOverrides', error, uid);
      fallBack();
    }
    return () => {
      active = false;
      stop?.();
      // Forget this user's overrides, so signing in again starts from a fresh snapshot.
      setOverrides(current =>
        current.uid === uid ? { uid: null, values: NO_OVERRIDES } : current,
      );
    };
  }, [uid]);

  // Overrides belong to one user: after sign-out or a user switch they no longer apply.
  const userOverrides = overrides.uid === uid ? overrides.values : NO_OVERRIDES;

  const flags = useMemo(
    () => evaluateAll(userOverrides, remote),
    [userOverrides, remote],
  );

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};

/** Every flag, evaluated. */
export const useFlags = (): EvaluatedFlags => useContext(FlagsContext);

/** Whether one feature flag is on for the current user. */
export const useFlag = (key: FlagKey): boolean => useContext(FlagsContext)[key];

export default FlagsProvider;
