import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

import { isPasswordValid } from '@/hooks/usePasswordValidation';
import { isValidDisplayDate, stringToDate } from '@/util';

const { t } = i18n;

export enum SignUpFields {
  email = 'email',
  firstName = 'firstName',
  lastName = 'lastName',
  dob = 'dateOfBirth',
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
}

// Same limits as the Firestore rules for users/{uid} (quadev-backend firestore.rules).
export const firstNameSchema = z
  .string({
    required_error: t('fieldError.firstNameRequiredError'),
  })
  .trim()
  .min(1, { message: t('fieldError.firstNameRequiredError') })
  .max(30, { message: t('fieldError.firstNameLengthError') });

export const lastNameSchema = z
  .string({
    required_error: t('fieldError.lastNameRequiredError'),
  })
  .trim()
  .min(1, { message: t('fieldError.lastNameRequiredError') })
  .max(30, { message: t('fieldError.lastNameLengthError') });

/** Optional (decision D16): empty is fine; anything entered must be a real, past DD/MM/YYYY date. */
export const optionalDateOfBirthSchema = z
  .string()
  .trim()
  .optional()
  .refine(dob => !dob || isValidDisplayDate(dob), {
    message: t('fieldError.dobFormatError'),
  })
  .refine(
    dob => !dob || !isValidDisplayDate(dob) || stringToDate(dob) <= new Date(),
    {
      message: t('fieldError.dobFutureError'),
    },
  );

export const signUpSchema = z
  .object({
    [SignUpFields.email]: z
      .string({
        required_error: t('fieldError.emailRequiredError'),
      })
      .trim()
      .email({ message: t('fieldError.emailFormatError') }),
    [SignUpFields.firstName]: firstNameSchema,
    [SignUpFields.lastName]: lastNameSchema,
    [SignUpFields.dob]: optionalDateOfBirthSchema,
    [SignUpFields.password]: z
      .string({
        required_error: t('fieldError.passwordRequiredError'),
      })
      .refine(password => isPasswordValid(password).isValid, {
        message: t('fieldError.passwordFormatError'),
      }),
    [SignUpFields.passwordConfirmation]: z.string({
      required_error: t('fieldError.passwordConfirmationRequiredError'),
    }),
  })
  .refine(
    data =>
      data[SignUpFields.password] === data[SignUpFields.passwordConfirmation],
    {
      message: t('fieldError.passwordConfirmationMatchError'),
      path: [SignUpFields.passwordConfirmation],
    },
  );

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
