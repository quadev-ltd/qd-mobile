import { type TFunction } from 'i18next';

import { FieldErrors } from './types';

export const AsynchErrorMessages = (
  t: TFunction<'translate'>,
  error: string,
): string | undefined => {
  switch (error) {
    case FieldErrors.AlreadyUsed:
      return t('signUp.emailAlreadyUsedError');
    case FieldErrors.InvalidEmailPassword:
      return t('signIn.invalidEmailOrPasswordError');
    case FieldErrors.Complex:
    case FieldErrors.Email:
    case FieldErrors.MaxLength:
    case FieldErrors.NotFuture:
    case FieldErrors.Required:
    default:
      return;
  }
};

export enum ParameterNames {
  UserID = ':userID',
  VerificationToken = ':verificationToken',
}

export enum APIEndpoints {
  SignUp = '/user',
  SignIn = '/user/sessions',
  ResendVerificationEmail = `/user/${ParameterNames.UserID}/email/verification`,
  VerifyEmail = `/user/${ParameterNames.UserID}/email/${ParameterNames.VerificationToken}`,
  RefreshToken = '/authentication/refresh',
  GetUserProfile = '/user/profile',
}
