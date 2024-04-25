import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

import { isPasswordValid } from '@/hooks/usePasswordValidation';

const { t } = i18n;

export enum SignInFields {
  email = 'email',
  password = 'password',
}

export const signInSchema = z.object({
  [SignInFields.email]: z
    .string({
      required_error: t('signIn.emailRequiredError'),
    })
    .email({ message: t('signIn.emailFormatError') }),
  [SignInFields.password]: z
    .string({
      required_error: t('signIn.passwordRequiredError'),
    })
    .refine(password => isPasswordValid(password).isValid, {
      message: t('signIn.passwordFormatError'),
    }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
