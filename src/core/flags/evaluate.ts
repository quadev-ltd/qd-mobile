import {
  type EvaluatedFlags,
  FLAG_KEYS,
  FLAGS,
  type FlagValues,
  isFlagKey,
} from './registry';

/** The evaluation rule (same as `@quadev/flags`): the user override wins, then Remote Config, then the default. */
export const evaluate = (
  override: boolean | undefined,
  remote: boolean | undefined,
  defaultValue: boolean,
): boolean => override ?? remote ?? defaultValue;

/** Evaluates every flag from the user's overrides and the active Remote Config values. */
export const evaluateAll = (
  overrides: FlagValues,
  remote: FlagValues,
): EvaluatedFlags =>
  Object.fromEntries(
    FLAG_KEYS.map(key => [
      key,
      evaluate(overrides[key], remote[key], FLAGS[key].default),
    ]),
  ) as EvaluatedFlags;

/**
 * Keeps only known flag keys with boolean values from a `featureFlags/{uid}` document. Other fields
 * (`updatedAt`, `updatedBy`) are metadata, and unknown keys are flags this app version does not know.
 */
export const parseOverrides = (data: unknown): FlagValues => {
  const overrides: FlagValues = {};
  if (data === null || typeof data !== 'object') {
    return overrides;
  }
  for (const [key, value] of Object.entries(data)) {
    if (isFlagKey(key) && typeof value === 'boolean') {
      overrides[key] = value;
    }
  }
  return overrides;
};
