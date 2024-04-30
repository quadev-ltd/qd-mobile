import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

const { t } = i18n;

export enum ForgotPasswordFields {
  email = 'email',
}

export const forgotPasswordSchema = z.object({
  [ForgotPasswordFields.email]: z
    .string({
      required_error: t('fieldError.emailRequiredError'),
    })
    .email({ message: t('fieldError.emailFormatError') }),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
