import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

import { isPasswordValid } from '@/hooks/usePasswordValidation';

const { t } = i18n;

export enum SignUpFields {
  email = 'email',
  firstName = 'first_name',
  lastName = 'last_name',
  dob = 'date_of_birth',
  password = 'password',
  passwordConfirmation = 'password_confirmation',
  terms = 'terms',
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
          const datePattern =
            /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
          return datePattern.test(dob);
        },
        {
          message: t('signUp.dobFormatError'),
        },
      )
      .refine(
        dob => {
          const datePattern =
            /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
          if (!datePattern.test(dob)) return true;
          const dobArray = dob.split('/');
          const year = parseInt(dobArray[2], 10);
          const month = parseInt(dobArray[1], 10) - 1; // Months are zero-indexed in JavaScript
          const day = parseInt(dobArray[0], 10);
          const parsedDate = new Date(year, month, day);
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

export type SignUpFormType = z.infer<typeof signUpSchema>;
