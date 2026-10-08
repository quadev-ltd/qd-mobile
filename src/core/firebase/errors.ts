import logger from '@/core/logger';

/** Auth error codes the app reacts to (RNFB prefixes them with "auth/"). */
export const AuthErrorCode = {
  EmailAlreadyInUse: 'auth/email-already-in-use',
  InvalidCredential: 'auth/invalid-credential',
  WrongPassword: 'auth/wrong-password',
  UserNotFound: 'auth/user-not-found',
  InvalidEmail: 'auth/invalid-email',
  TooManyRequests: 'auth/too-many-requests',
  NetworkRequestFailed: 'auth/network-request-failed',
  PasswordDoesNotMeetRequirements: 'auth/password-does-not-meet-requirements',
  WeakPassword: 'auth/weak-password',
  RequiresRecentLogin: 'auth/requires-recent-login',
  UserDisabled: 'auth/user-disabled',
  AccountExistsWithDifferentCredential:
    'auth/account-exists-with-different-credential',
  UserMismatch: 'auth/user-mismatch',
} as const;

/** Thrown by the service layer when a precondition fails before Firebase is called. */
export class AppAuthError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = 'AppAuthError';
  }
}

export const NO_CURRENT_USER = 'app/no-current-user';
export const MISSING_PROVIDER_TOKEN = 'app/missing-provider-token';
export const SIGN_IN_CANCELLED = 'app/sign-in-cancelled';

export const getErrorCode = (error: unknown): string | undefined => {
  if (error && typeof error === 'object' && 'code' in error) {
    const { code } = error as { code: unknown };
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
};

/** Firestore and Functions codes arrive as "firestore/x", "functions/x" or a bare "x". */
const shortCode = (code: string) =>
  code.startsWith('firestore/') || code.startsWith('functions/')
    ? code.slice(code.indexOf('/') + 1)
    : code;

/**
 * Maps a Firebase error to an i18n key. Unknown errors map to the generic "try again" message.
 */
export const getErrorMessageKey = (error: unknown): string => {
  const code = getErrorCode(error);
  if (!code) {
    return 'error.unexpectedErrorRetry';
  }
  switch (code) {
    case AuthErrorCode.EmailAlreadyInUse:
      return 'fieldError.emailAlreadyUsedError';
    case AuthErrorCode.InvalidCredential:
    case AuthErrorCode.WrongPassword:
    case AuthErrorCode.UserNotFound:
      return 'fieldError.invalidEmailOrPasswordError';
    case AuthErrorCode.InvalidEmail:
      return 'fieldError.emailFormatError';
    case AuthErrorCode.TooManyRequests:
      return 'error.tooManyRequestsError';
    case AuthErrorCode.NetworkRequestFailed:
      return 'error.networkError';
    case AuthErrorCode.PasswordDoesNotMeetRequirements:
    case AuthErrorCode.WeakPassword:
      return 'fieldError.passwordNotComplexError';
    case AuthErrorCode.RequiresRecentLogin:
      return 'error.requiresRecentLogin';
    case AuthErrorCode.UserDisabled:
      return 'error.userDisabled';
    case AuthErrorCode.AccountExistsWithDifferentCredential:
      return 'error.accountExistsWithDifferentCredential';
    case AuthErrorCode.UserMismatch:
      return 'error.reauthUserMismatch';
    default:
      break;
  }
  switch (shortCode(code)) {
    case 'unavailable':
    case 'deadline-exceeded':
      return 'error.networkError';
    case 'permission-denied':
    case 'unauthenticated':
      return 'error.serverSideError';
    default:
      return 'error.unexpectedErrorRetry';
  }
};

/** Codes that are expected user mistakes, not bugs; they are not reported to Crashlytics. */
const EXPECTED_CODES: ReadonlySet<string> = new Set([
  AuthErrorCode.EmailAlreadyInUse,
  AuthErrorCode.InvalidCredential,
  AuthErrorCode.WrongPassword,
  AuthErrorCode.UserNotFound,
  AuthErrorCode.InvalidEmail,
  AuthErrorCode.TooManyRequests,
  AuthErrorCode.NetworkRequestFailed,
  AuthErrorCode.PasswordDoesNotMeetRequirements,
  AuthErrorCode.WeakPassword,
  AuthErrorCode.RequiresRecentLogin,
  SIGN_IN_CANCELLED,
]);

/**
 * Logs an error without personal data: only the operation, the error code and the uid (if any).
 * Never pass emails, names, tokens or raw error bodies here.
 */
export const logFirebaseError = (
  operation: string,
  error: unknown,
  uid?: string | null,
) => {
  const code = getErrorCode(error) ?? 'unknown';
  const message = `${operation} failed: code=${code}${
    uid ? ` uid=${uid}` : ''
  }`;
  if (EXPECTED_CODES.has(code)) {
    logger().logMessage(message);
  } else {
    logger().logError(new Error(message));
  }
};
