import { type Timestamp } from '../../util/index';
import { type User } from '../state/slices/userSlice';

export enum FieldErrors {
  Email = 'email',
  Required = 'required',
  Complex = 'complex',
  AlreadyUsed = 'already_used',
  MaxLength = 'max',
  NotFuture = 'not_future',
  InvalidEmailPassword = 'invalid_email_password',
}

export enum APIError {
  InvalidUserIDError = 'invalid_user_id',
  InvalidEmailError = 'invalid_email',
  EmailVerifiedError = 'email_already_verified',
  InvalidTokenError = 'invalid_token',
  TokenExpiredError = 'token_expired',
  TooManyRequestsError = 'too_many_requests',
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
  user: User;
}

// SignIn
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  authToken: string;
  authTokenExpiry: Timestamp;
  refreshToken: string;
  refreshTokenExpiry: Timestamp;
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
  user: User;
}
