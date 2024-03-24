// eslint-disable-next-line no-restricted-imports
import { Config } from 'react-native-config';
import { z } from 'zod';

export const ApplicationEnvironentEnum = z.enum(['test', 'dev', 'prod']);

export const envSchema = z.object({
  APPLICATION_NAME: z.string(),
  APPLICATION_ENVIRONMENT: ApplicationEnvironentEnum,
});

// validate config variables
const parsed = envSchema.safeParse(Config);
if (!parsed.success) {
  const errorMessage = `Invalid config variables: ${JSON.stringify(
    parsed.error.flatten().fieldErrors,
    null,
    2,
  )}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const env = parsed.data;
