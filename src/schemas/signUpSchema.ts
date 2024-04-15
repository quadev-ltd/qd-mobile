import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

import { isPasswordValid } from '@/hooks/usePasswordValidation';
import { stringToDate, validateDatePattern } from '@/util';

const { t } = i18n;

export enum SignUpFields {
  email = 'email',
  firstName = 'first_name',
  lastName = 'last_name',
  dob = 'date_of_birth',
  password = 'password',
  passwordConfirmation = 'password_confirmation',
}

export const signUpSchema = z
  .object({
    [SignUpFields.email]: z
      .string({
        required_error: t('signUp.emailRequiredError'),
      })
      .email({ message: t('signUp.emailFormatError') }),
    [SignUpFields.firstName]: z
      .string({
        required_error: t('signUp.firstNameRequiredError'),
      })
      .min(1, { message: t('signUp.firstNameRequiredError') })
      .max(30, { message: t('signUp.firstNameLengthError') }),
    [SignUpFields.lastName]: z
      .string({
        required_error: t('signUp.lastNameRequiredError'),
      })
      .min(1, { message: t('signUp.lastNameRequiredError') })
      .max(30, { message: t('signUp.lastNameLengthError') }),
    [SignUpFields.dob]: z
      .string({
        required_error: t('signUp.dobRequiredError'),
      })
      .min(1, { message: t('signUp.dobRequiredError') })
      .refine(
        dob => {
          return validateDatePattern(dob);
        },
        {
          message: t('signUp.dobFormatError'),
        },
      )
      .refine(
        dob => {
          if (!validateDatePattern(dob)) return true;
          const parsedDate = stringToDate(dob);
          return parsedDate <= new Date();
        },
        {
          message: t('signUp.dobFutureError'),
        },
      ),
    [SignUpFields.password]: z
      .string({
        required_error: t('signUp.passwordRequiredError'),
      })
      .refine(password => isPasswordValid(password).isValid, {
        message: t('signUp.passwordFormatError'),
      }),
    [SignUpFields.passwordConfirmation]: z.string({
      required_error: t('signUp.passwordConfirmationRequiredError'),
    }),
  })
  .refine(
    data =>
      data[SignUpFields.password] === data[SignUpFields.passwordConfirmation],
    {
      message: t('signUp.passwordConfirmationMatchError'),
      path: [SignUpFields.passwordConfirmation],
    },
  );

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
