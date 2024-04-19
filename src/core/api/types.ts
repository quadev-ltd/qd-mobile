import { type Timestamp } from '../../util/index';

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

export interface User {
  email: string;
  userID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  registrationDate: Timestamp;
  accountStatus: string;
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
  password_confirmation: string;
}

export interface SignUpResponse extends BaseResponse {
  user: User;
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

export interface VerifyEmailResponse extends BaseResponse {
  authToken: string;
  authTokenExpiry: Timestamp;
  refreshToken: string;
  refreshTokenExpiry: Timestamp;
  userEmail: string;
  userID: string;
}
