import {
  authStateChanged,
  claimsChanged,
  deriveSessionStatus,
  initialSessionState,
  profileFailed,
  profileLoaded,
  profileSetupFinished,
  profileSetupStarted,
  providerNamesReceived,
  sessionSlice,
  type SessionState,
  SessionStatus,
} from './sessionSlice';

import { type SessionUser } from '@/core/firebase/types';

const reducer = sessionSlice.reducer;

const user = (overrides: Partial<SessionUser> = {}): SessionUser => ({
  uid: 'uid-1',
  email: 'ada@example.com',
  emailVerified: true,
  displayName: null,
  providerIds: ['password'],
  ...overrides,
});

const run = (...actions: Parameters<typeof reducer>[1][]) =>
  actions.reduce<SessionState>(
    (state, action) => reducer(state, action),
    initialSessionState,
  );

describe('session status', () => {
  it('starts initializing', () => {
    expect(initialSessionState.status).toBe(SessionStatus.Initializing);
  });

  it('is signedOut when Firebase reports no user', () => {
    expect(run(authStateChanged(null)).status).toBe(SessionStatus.SignedOut);
  });

  it('asks an unverified email/password user to verify', () => {
    const state = run(authStateChanged(user({ emailVerified: false })));
    expect(state.status).toBe(SessionStatus.NeedsEmailVerification);
  });

  it.each(['google.com', 'apple.com'])(
    'treats %s users as verified',
    provider => {
      const state = run(
        authStateChanged(
          user({ emailVerified: false, providerIds: [provider] }),
        ),
        profileLoaded({ firstName: 'Ada', lastName: 'L' }),
      );
      expect(state.status).toBe(SessionStatus.Ready);
    },
  );

  it('waits for the profile of a verified user', () => {
    expect(run(authStateChanged(user())).status).toBe(
      SessionStatus.Initializing,
    );
  });

  it('needs a profile when the document is missing or has no names', () => {
    expect(run(authStateChanged(user()), profileLoaded(null)).status).toBe(
      SessionStatus.NeedsProfile,
    );
    expect(
      run(
        authStateChanged(user()),
        profileLoaded({ firstName: 'Ada', lastName: ' ' }),
      ).status,
    ).toBe(SessionStatus.NeedsProfile);
    expect(run(authStateChanged(user()), profileFailed()).status).toBe(
      SessionStatus.NeedsProfile,
    );
  });

  it('is ready with a complete profile, with or without a date of birth', () => {
    const state = run(
      authStateChanged(user()),
      profileLoaded({ firstName: 'Ada', lastName: 'L' }),
    );
    expect(state.status).toBe(SessionStatus.Ready);
    expect(state.profile).toEqual({ firstName: 'Ada', lastName: 'L' });
  });

  it('becomes ready after email verification without reloading the profile', () => {
    const state = run(
      authStateChanged(user({ emailVerified: false })),
      profileLoaded({ firstName: 'Ada', lastName: 'L' }),
      authStateChanged(user({ emailVerified: true })),
    );
    expect(state.status).toBe(SessionStatus.Ready);
  });

  it('holds on the loading screen while SSO creates the profile', () => {
    const pending = run(
      profileSetupStarted(),
      authStateChanged(user({ providerIds: ['google.com'] })),
      profileLoaded(null),
    );
    expect(pending.status).toBe(SessionStatus.Initializing);
    expect(reducer(pending, profileSetupFinished()).status).toBe(
      SessionStatus.NeedsProfile,
    );
  });

  it('resets everything on sign-out', () => {
    const state = run(
      authStateChanged(user()),
      profileLoaded({ firstName: 'Ada', lastName: 'L' }),
      claimsChanged({ paid: true, admin: false }),
      providerNamesReceived({ firstName: 'Ada' }),
      authStateChanged(null),
    );
    expect(state).toEqual({
      ...initialSessionState,
      authResolved: true,
      status: SessionStatus.SignedOut,
    });
  });

  it('drops the previous profile when a different user signs in', () => {
    const state = run(
      authStateChanged(user()),
      profileLoaded({ firstName: 'Ada', lastName: 'L' }),
      authStateChanged(user({ uid: 'uid-2' })),
    );
    expect(state.profile).toBeNull();
    expect(state.status).toBe(SessionStatus.Initializing);
  });

  it('ignores profile events without a user', () => {
    const state = run(authStateChanged(null), profileLoaded(null));
    expect(state.status).toBe(SessionStatus.SignedOut);
  });

  it('keeps provider names that arrive before the auth event', () => {
    const state = run(
      providerNamesReceived({ firstName: 'Ada' }),
      authStateChanged(user({ providerIds: ['apple.com'] })),
    );
    expect(state.providerNames).toEqual({ firstName: 'Ada' });
  });
});

describe('deriveSessionStatus', () => {
  it('is initializing until auth is resolved', () => {
    expect(deriveSessionStatus({ ...initialSessionState, user: user() })).toBe(
      SessionStatus.Initializing,
    );
  });
});
