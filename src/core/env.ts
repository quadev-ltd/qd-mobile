import { z } from 'zod';

export const ApplicationEnvironentEnum = z.enum(['test', 'dev', 'prod']);

export const envSchema = z.object({
  APPLICATION_NAME: z.string(),
  APPLICATION_ENVIRONMENT: ApplicationEnvironentEnum,
  APPLICATION_VERSION: z.string(),
  BASE_URL: z.string(),
  DEEP_LINKING_DOMAIN: z.string(),
  CLIENT_ID: z.string(),
  REVERSED_CLIENT_ID: z.string(),
});

// Expo inlines EXPO_PUBLIC_* variables at build time, which only works with
// static dot access (no destructuring or computed keys).
const config = {
  APPLICATION_NAME: process.env.EXPO_PUBLIC_APPLICATION_NAME,
  APPLICATION_ENVIRONMENT: process.env.EXPO_PUBLIC_APPLICATION_ENVIRONMENT,
  APPLICATION_VERSION: process.env.EXPO_PUBLIC_APPLICATION_VERSION,
  BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
  DEEP_LINKING_DOMAIN: process.env.EXPO_PUBLIC_DEEP_LINKING_DOMAIN,
  CLIENT_ID: process.env.EXPO_PUBLIC_CLIENT_ID,
  REVERSED_CLIENT_ID: process.env.EXPO_PUBLIC_REVERSED_CLIENT_ID,
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
