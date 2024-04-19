import { i18n } from '@/core/i18n/i18n';

const { t } = i18n;

export enum FieldErrors {
  Email = 'email',
  Required = 'required',
  Complex = 'complex',
  AlreadyUsed = 'already_used',
  MaxLength = 'max',
  NotFuture = 'not_future',
}

export enum APIError {
  InvalidUserIDError = 'invalid_user_id',
  InvalidEmailError = 'invalid_email',
  EmailVerifiedError = 'email_already_verified',
  InvalidTokenError = 'invalid_token',
  TokenExpiredError = 'token_expired',
  TooManyRequestsError = 'too_many_requests',
}

export const AsynchErrorMessages: { [key: string]: string } = {
  [FieldErrors.AlreadyUsed]: t('signUp.emailAlreadyUsedError') as string,
  [FieldErrors.Complex]: 'complex',
  [FieldErrors.Email]: 'email',
  [FieldErrors.MaxLength]: 'max',
  [FieldErrors.NotFuture]: 'not_future',
  [FieldErrors.Required]: 'required',
};

export enum ParameterNames {
  UserID = ':user_id',
  VerificationToken = ':verification_token',
}

export enum APIEndpoints {
  SignUp = '/user',
  ResendVerificationEmail = `/user/${ParameterNames.UserID}/email/verification`,
  VerifyEmail = `/user/${ParameterNames.UserID}/email/${ParameterNames.VerificationToken}`,
}
