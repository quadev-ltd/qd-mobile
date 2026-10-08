import { z } from 'zod';

export const ApplicationEnvironentEnum = z.enum(['test', 'dev', 'prod']);

export const envSchema = z.object({
  APPLICATION_NAME: z.string(),
  APPLICATION_ENVIRONMENT: ApplicationEnvironentEnum,
  DEEP_LINKING_DOMAIN: z.string(),
  CLIENT_ID: z.string(),
  // "true" connects Auth, Firestore and Functions to the local Firebase emulators (dev/E2E only).
  USE_FIREBASE_EMULATORS: z
    .enum(['true', 'false', ''])
    .optional()
    .transform(value => value === 'true'),
});

// Expo inlines EXPO_PUBLIC_* variables at build time, which only works with
// static dot access (no destructuring or computed keys).
const config = {
  APPLICATION_NAME: process.env.EXPO_PUBLIC_APPLICATION_NAME,
  APPLICATION_ENVIRONMENT: process.env.EXPO_PUBLIC_APPLICATION_ENVIRONMENT,
  DEEP_LINKING_DOMAIN: process.env.EXPO_PUBLIC_DEEP_LINKING_DOMAIN,
  CLIENT_ID: process.env.EXPO_PUBLIC_CLIENT_ID,
  USE_FIREBASE_EMULATORS: process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS,
};

// validate config variables
const parsed = envSchema.safeParse(config);
if (!parsed.success) {
  const errorMessage = `Invalid config variables: ${JSON.stringify(
    parsed.error.flatten().fieldErrors,
    null,
    2,
  )}`;
  throw new Error(errorMessage);
}

export const env = parsed.data;
