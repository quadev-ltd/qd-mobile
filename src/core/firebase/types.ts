// Plain, serialisable shapes the rest of the app uses instead of Firebase classes.

export const PASSWORD_PROVIDER_ID = 'password';
export const GOOGLE_PROVIDER_ID = 'google.com';
export const APPLE_PROVIDER_ID = 'apple.com';

export interface SessionUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  providerIds: string[];
}

/** `users/{uid}` as the app sees it. `dateOfBirth` is `YYYY-MM-DD` and optional (decision D16). */
export interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

/** Names shared by Google or Apple at sign-in (Apple only on the first authorisation). */
export interface ProviderNames {
  firstName?: string;
  lastName?: string;
}

export interface Claims {
  paid: boolean;
  admin: boolean;
}

export type ReauthMethod = 'password' | 'google' | 'apple';

// Pure helpers (no Firebase imports), shared by the service layer and the session slice.

/** Google and Apple confirm the email themselves; only email/password users must verify it. */
export const isVerifiedUser = (user: SessionUser): boolean =>
  user.emailVerified ||
  user.providerIds.some(
    id => id === GOOGLE_PROVIDER_ID || id === APPLE_PROVIDER_ID,
  );

export const hasCompleteNames = (
  profile?: Partial<UserProfile> | null,
): boolean => Boolean(profile?.firstName?.trim() && profile?.lastName?.trim());
