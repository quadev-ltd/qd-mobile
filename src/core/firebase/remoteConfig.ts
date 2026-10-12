import {
  activate,
  ensureInitialized,
  fetchAndActivate,
  getValue,
  onConfigUpdate,
  type RemoteConfig,
} from '@react-native-firebase/remote-config';

import { remoteConfig } from './app';
import { getErrorCode } from './errors';

import {
  DEFAULT_FLAGS,
  FLAG_KEYS,
  type FlagValues,
} from '@/core/flags/registry';
import logger from '@/core/logger';

// Parameters: quadev-backend remoteconfig.template.json (one BOOLEAN per flag, same keys as the
// registry). Only values that come from the server count; anything else falls back to the code default.

const FETCH_TIMEOUT_MILLIS = 30 * 1000;

/** The active values that came from the server (source "remote"); nothing for the rest. */
export const readRemoteFlags = (config: RemoteConfig): FlagValues => {
  const values: FlagValues = {};
  for (const key of FLAG_KEYS) {
    const value = getValue(config, key);
    if (value.getSource() === 'remote') {
      values[key] = value.asBoolean();
    }
  }
  return values;
};

// Fetch failures are normal (offline, throttled), so they are breadcrumbs, not Crashlytics errors.
const logFailure = (operation: string, error: unknown) =>
  logger().logMessage(
    `remoteConfig.${operation} failed: code=${
      getErrorCode(error) ?? 'unknown'
    }; using defaults`,
  );

/**
 * Starts Remote Config for the feature flags: in-app defaults from the registry, the values activated
 * last time, then a fetch, then real-time updates (`onConfigUpdate` → `activate`). Calls `onValues`
 * with the server values each time they change. Never throws; on any failure the flags keep their
 * previous values (at first, the code defaults). Returns a function that stops the updates.
 */
export const startRemoteConfig = (
  onValues: (values: FlagValues) => void,
  { minimumFetchIntervalMillis }: { minimumFetchIntervalMillis: number },
): (() => void) => {
  let stopped = false;
  let unsubscribe: (() => void) | undefined;

  let config: RemoteConfig | null;
  try {
    config = remoteConfig();
    if (!config) {
      return () => undefined;
    }
    // Property setters, as in the Firebase JS SDK; the native calls are queued before the fetch.
    config.defaultConfig = { ...DEFAULT_FLAGS };
    config.settings = {
      minimumFetchIntervalMillis,
      fetchTimeoutMillis: FETCH_TIMEOUT_MILLIS,
    };
  } catch (error) {
    logFailure('init', error);
    return () => undefined;
  }
  const rc = config;

  const publish = () => {
    if (!stopped) {
      onValues(readRemoteFlags(rc));
    }
  };

  const start = async () => {
    try {
      // The values activated in an earlier session apply straight away, before the fetch returns.
      await ensureInitialized(rc);
      publish();
    } catch (error) {
      logFailure('ensureInitialized', error);
    }
    try {
      await fetchAndActivate(rc);
      publish();
    } catch (error) {
      logFailure('fetchAndActivate', error);
    }
    if (stopped) {
      return;
    }
    try {
      unsubscribe = onConfigUpdate(rc, {
        next: () => {
          activate(rc)
            .then(publish)
            .catch(error => logFailure('activate', error));
        },
        error: error => logFailure('onConfigUpdate', error),
        complete: () => undefined,
      });
    } catch (error) {
      logFailure('onConfigUpdate', error);
    }
  };

  start().catch(error => logFailure('start', error));

  return () => {
    stopped = true;
    unsubscribe?.();
  };
};
