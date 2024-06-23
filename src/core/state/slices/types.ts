import { type Timestamp } from '@/util';

export enum ClaimName {
  EmailClaim = 'email',
  ExpiryClaim = 'exp',
  IssuedAtClaim = 'iat',
  NonceClaim = 'nonce',
  TypeClaim = 'type',
  UserIDClaim = 'user_id',
}

export interface TokenPayload {
  [ClaimName.EmailClaim]: string;
  [ClaimName.ExpiryClaim]: number;
  [ClaimName.IssuedAtClaim]: number;
  [ClaimName.NonceClaim]: string;
  [ClaimName.TypeClaim]: string;
  [ClaimName.UserIDClaim]: string;
}

export const LOGOUT = 'logout';

// User slice
export interface UserState {
  email: string;
  userID: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Timestamp;
  registrationDate: Timestamp;
  accountStatus: string;
}

//  Auth slice
export enum AuthStateStatus {
  Pending = 'PENDING',
  Authenticated = 'AUTHENTICATED',
  Unauthenticated = 'UNAUTHENTICATED',
}

export enum AccountStatus {
  Unverified = 'Unverified',
  Verified = 'Verified',
}

export interface AuthState {
  status: AuthStateStatus;
  authToken?: string;
  tokenExpiry?: Date;
}
