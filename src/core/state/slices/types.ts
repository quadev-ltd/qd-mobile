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
