import { FieldErrors } from './types';

import { i18n } from '@/core/i18n/i18n';

const { t } = i18n;

export const AsynchErrorMessages: { [key: string]: string } = {
  [FieldErrors.AlreadyUsed]: t('signUp.emailAlreadyUsedError') as string,
  [FieldErrors.Complex]: 'complex',
  [FieldErrors.Email]: 'email',
  [FieldErrors.MaxLength]: 'max',
  [FieldErrors.NotFuture]: 'not_future',
  [FieldErrors.Required]: 'required',
};

export enum ParameterNames {
  UserID = ':userID',
  VerificationToken = ':verificationToken',
}

export enum APIEndpoints {
  SignUp = '/user',
  ResendVerificationEmail = `/user/${ParameterNames.UserID}/email/verification`,
  VerifyEmail = `/user/${ParameterNames.UserID}/email/${ParameterNames.VerificationToken}`,
  RefreshToken = '/authentication/refresh',
}
