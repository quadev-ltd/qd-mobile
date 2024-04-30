import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

import { isPasswordValid } from '@/hooks/usePasswordValidation';
import { stringToDate, validateDatePattern } from '@/util';

const { t } = i18n;

export enum SignUpFields {
  email = 'email',
  firstName = 'firstName',
  lastName = 'lastName',
  dob = 'dateOfBirth',
  password = 'password',
  passwordConfirmation = 'passwordConfirmation',
}

export const signUpSchema = z
  .object({
    [SignUpFields.email]: z
      .string({
        required_error: t('fieldError.emailRequiredError'),
      })
      .email({ message: t('fieldError.emailFormatError') }),
    [SignUpFields.firstName]: z
      .string({
        required_error: t('fieldError.firstNameRequiredError'),
      })
      .min(1, { message: t('fieldError.firstNameRequiredError') })
      .max(30, { message: t('fieldError.firstNameLengthError') }),
    [SignUpFields.lastName]: z
      .string({
        required_error: t('fieldError.lastNameRequiredError'),
      })
      .min(1, { message: t('fieldError.lastNameRequiredError') })
      .max(30, { message: t('fieldError.lastNameLengthError') }),
    [SignUpFields.dob]: z
      .string({
        required_error: t('fieldError.dobRequiredError'),
      })
      .min(1, { message: t('fieldError.dobRequiredError') })
      .refine(
        dob => {
          return validateDatePattern(dob);
        },
        {
          message: t('fieldError.dobFormatError'),
        },
      )
      .refine(
        dob => {
          if (!validateDatePattern(dob)) return true;
          const parsedDate = stringToDate(dob);
          return parsedDate <= new Date();
        },
        {
          message: t('fieldError.dobFutureError'),
        },
      ),
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
