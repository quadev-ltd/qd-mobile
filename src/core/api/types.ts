import { type Timestamp } from '../../util/index';
import { type UserState } from '../state/slices/types';

export enum ParameterNames {
  UserID = ':userID',
  VerificationToken = ':verificationToken',
}

export enum APIEndpoints {
  SignUp = '/user',
  SignIn = '/user/sessions',
  SignInWithFirebase = '/user/firebase/sessions',
  ResendVerificationEmail = `/user/${ParameterNames.UserID}/email/verification`,
  VerifyEmail = `/user/${ParameterNames.UserID}/email/${ParameterNames.VerificationToken}`,
  RequestPasswordReset = '/user/password/reset',
  RefreshAuthTokens = '/authentication/refresh',
  GetUserProfile = '/user/profile',
  VerifyPasswordVerificationToken = `/user/${ParameterNames.UserID}/password/reset-verification/${ParameterNames.VerificationToken}`,
  ResetPassword = `/user/${ParameterNames.UserID}/password/reset/${ParameterNames.VerificationToken}`,
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DeleteAccount = '/user',
}

export enum AIEndpoints {
  DetectAnomaly = '/detect',
}

export enum FieldErrors {
  Email = 'email',
  Required = 'required',
  Complex = 'complex',
  AlreadyUsed = 'already_used',
  MaxLength = 'max',
  NotFuture = 'not_future',
  InvalidEmailPassword = 'invalid_email_password',
  FirebaseVerification = 'firebase_verification_failed',
}

export enum APIError {
  InvalidUserIDError = 'invalid_user_id',
  InvalidEmailError = 'invalid_email',
  EmailVerifiedError = 'email_already_verified',
  InvalidTokenError = 'invalid_token',
  TokenExpiredError = 'token_expired',
  TooManyRequestsError = 'too_many_requests',
  UnmanagedError = 'unmanaged_error',
}

export enum Methods {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface FieldError {
  error: string;
  field: string;
}

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface ResponseError {
  data?: {
    error: string;
    field_errors?: FieldError[];
  };
  status: number;
}

// SignUp
export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: {
    seconds: number;
    nanos: number;
  };
  password: string;
  passwordConfirmation: string;
}

export interface SignUpResponse extends BaseResponse {
  user: UserState;
}

// SignIn
export interface SignInRequest {
  email: string;
  password: string;
}

// SignInWithFirebse
export interface SignInWithFirebseRequest {
  email: string;
  firstName: string;
  lastName: string;
  idToken: string;
}

export interface AuthenticationResponse {
  authToken: string;
  refreshToken: string;
}

// Resend Verification Email
export interface ResendVerificationRequest {
  userID: string;
}

// Verify Email
export interface VerifyEmailRequest {
  userID: string;
  verificationToken: string;
}

export interface VerifyEmailResponse {
  authToken: string;
  authTokenExpiry: Timestamp;
  refreshToken: string;
  refreshTokenExpiry: Timestamp;
}

// GetUserProfile
export interface GetUserProfileResponse {
  user: UserState;
}

// Request Password Reset
export interface ForgotPasswordRequest {
  email: string;
}

// Verify reset password verification token
export interface VerifyResetPasswordTokenRequest {
  userID: string;
  verificationToken: string;
}

// Reset password
export interface ResetPasswordRequest {
  userID: string;
  verificationToken: string;
  password: string;
}

// Refresh Auth Tokens
export interface RefreshAuthTokensRequest {
  refreshToken: string | null;
}

// Anomaly Detection
export type AnomalyDetectionRequest = {
  photo: string;
  description: string;
};

export type AnomalyDetectionResponse = {
  text: string;
};
