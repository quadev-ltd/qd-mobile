import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

import { isPasswordValid } from '@/hooks/usePasswordValidation';

const { t } = i18n;

export enum ResetPasswordFields {
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
}

export const resetPasswordSchema = z
  .object({
    [ResetPasswordFields.password]: z
      .string({
        required_error: t('fieldError.passwordRequiredError'),
      })
      .refine(password => isPasswordValid(password).isValid, {
        message: t('fieldError.passwordFormatError'),
      }),
    [ResetPasswordFields.passwordConfirmation]: z.string({
      required_error: t('fieldError.passwordConfirmationRequiredError'),
    }),
  })
  .refine(
    data =>
      data[ResetPasswordFields.password] ===
      data[ResetPasswordFields.passwordConfirmation],
    {
      message: t('fieldError.passwordConfirmationMatchError'),
      path: [ResetPasswordFields.passwordConfirmation],
    },
  );

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
