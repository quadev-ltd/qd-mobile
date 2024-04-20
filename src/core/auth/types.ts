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
  [ClaimName.ExpiryClaim]: Timestamp;
  [ClaimName.IssuedAtClaim]: Timestamp;
  [ClaimName.NonceClaim]: string;
  [ClaimName.TypeClaim]: string;
  [ClaimName.UserIDClaim]: string;
}
