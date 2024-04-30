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
      required_error: t('fieldError.emailRequiredError'),
    })
    .email({ message: t('fieldError.emailFormatError') }),
  [SignInFields.password]: z
    .string({
      required_error: t('fieldError.passwordRequiredError'),
    })
    .refine(password => isPasswordValid(password).isValid, {
      message: t('fieldError.passwordFormatError'),
    }),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
