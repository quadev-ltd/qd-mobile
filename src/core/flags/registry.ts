/**
 * Feature flags (D18, ADR 0013). Mirrors the registry in quadev-backend `packages/flags/src/index.ts`
 * (`@quadev/flags`): same keys, defaults and descriptions. When a flag is added there and the app needs
 * it, add it here too (and to quadev-backend `remoteconfig.template.json`, which a backend test checks).
 *
 * Evaluation order: the per-user override in `featureFlags/{uid}`, then Remote Config, then the code
 * default below.
 */

export interface FlagDefinition {
  /** Value when neither a user override nor Remote Config sets the flag. */
  readonly default: boolean;
  readonly description: string;
}

export const FLAGS = {
  smartInspection: {
    default: false,
    description:
      'Smart inspection (image anomaly detection) in the app; hidden until the Gemini version ships.',
  },
  interviewAssistant: {
    default: false,
    description: 'Interview Assist: interview practice and live note-taker.',
  },
  aiDiagnostics: {
    default: false,
    description:
      'Admin-only ai.aiDiagnostics callable: one tiny model call to check the AI core end to end.',
  },
} as const satisfies Record<string, FlagDefinition>;

export type FlagKey = keyof typeof FLAGS;

export const FLAG_KEYS = Object.keys(FLAGS) as FlagKey[];

/** Firestore collection with one optional override document per uid: `featureFlags/{uid}`. */
export const FEATURE_FLAGS_COLLECTION = 'featureFlags';

/** A value per flag, e.g. the overrides of one user or the active Remote Config values. */
export type FlagValues = Partial<Record<FlagKey, boolean>>;

export type EvaluatedFlags = Record<FlagKey, boolean>;

export const isFlagKey = (value: string): value is FlagKey =>
  Object.prototype.hasOwnProperty.call(FLAGS, value);

/** The code defaults, used as the Remote Config in-app defaults and when nothing else is known. */
export const DEFAULT_FLAGS: EvaluatedFlags = Object.fromEntries(
  FLAG_KEYS.map(key => [key, FLAGS[key].default]),
) as EvaluatedFlags;
