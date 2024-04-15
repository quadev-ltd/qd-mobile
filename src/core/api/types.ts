import { type Timestamp } from '../../util/index';

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
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: Timestamp;
  registration_date: Timestamp;
  account_status: string;
}

// SignUp
export interface SignUpFormType {
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: {
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
