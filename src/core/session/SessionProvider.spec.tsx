import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Provider } from 'react-redux';

import { SessionProvider } from './SessionProvider';

import {
  getCurrentSessionUser,
  subscribeToAuthState,
} from '@/core/firebase/auth';
import { getClaims } from '@/core/firebase/claims';
import { watchProfile } from '@/core/firebase/profile';
import { type SessionUser } from '@/core/firebase/types';
import { SessionStatus } from '@/core/state/slices/sessionSlice';
import { createStore } from '@/core/state/store';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/firebase/auth', () => ({
  subscribeToAuthState: jest.fn(),
  getCurrentSessionUser: jest.fn(),
}));
jest.mock('@/core/firebase/profile', () => ({ watchProfile: jest.fn() }));
jest.mock('@/core/firebase/claims', () => ({ getClaims: jest.fn() }));

const user: SessionUser = {
  uid: 'uid-1',
  email: 'ada@example.com',
  emailVerified: true,
  displayName: null,
  providerIds: ['password'],
};

describe('SessionProvider', () => {
  let emitUser: (value: SessionUser | null) => void;
  let emitProfile: (value: unknown) => void;
  let emitProfileError: (error: unknown) => void;
  const stopAuth = jest.fn();
  const stopProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (subscribeToAuthState as jest.Mock).mockImplementation(listener => {
      emitUser = listener;
      return stopAuth;
    });
    (watchProfile as jest.Mock).mockImplementation((_uid, onNext, onError) => {
      emitProfile = onNext;
      emitProfileError = onError;
      return stopProfile;
    });
    (getClaims as jest.Mock).mockResolvedValue({ paid: true, admin: false });
  });

  const renderProvider = () => {
    const store = createStore();
    const utils = render(
      <Provider store={store}>
        <SessionProvider>
          <Text>child</Text>
        </SessionProvider>
      </Provider>,
    );
    return { store, ...utils };
  };

  it('follows auth, profile and claims, and cleans up', async () => {
    const { store, getByText, unmount } = renderProvider();
    expect(getByText('child')).toBeTruthy();
    expect(store.getState().session.status).toBe(SessionStatus.Initializing);

    await act(async () => emitUser(user));
    expect(watchProfile).toHaveBeenCalledWith(
      'uid-1',
      expect.any(Function),
      expect.any(Function),
    );
    expect(store.getState().session.claims.paid).toBe(true);

    await act(async () => emitProfile({ firstName: 'Ada', lastName: 'L' }));
    expect(store.getState().session.status).toBe(SessionStatus.Ready);

    // Token refresh for the same user: no second profile listener.
    await act(async () => emitUser({ ...user }));
    expect(watchProfile).toHaveBeenCalledTimes(1);

    await act(async () => emitUser(null));
    expect(stopProfile).toHaveBeenCalled();
    expect(store.getState().session.status).toBe(SessionStatus.SignedOut);

    unmount();
    expect(stopAuth).toHaveBeenCalled();
  });

  it('ignores a profile listener error once the user has signed out', async () => {
    const { store } = renderProvider();
    await act(async () => emitUser(user));
    (getCurrentSessionUser as jest.Mock).mockReturnValue(null);
    await act(async () =>
      emitProfileError({ code: 'firestore/permission-denied' }),
    );
    expect(store.getState().session.profileStatus).toBe('loading');

    (getCurrentSessionUser as jest.Mock).mockReturnValue(user);
    await act(async () =>
      emitProfileError({ code: 'firestore/permission-denied' }),
    );
    expect(store.getState().session.status).toBe(SessionStatus.NeedsProfile);
  });

  it('leaves the splash state when Firebase cannot be reached', () => {
    (subscribeToAuthState as jest.Mock).mockImplementation(() => {
      throw new Error('native module missing');
    });
    const { store } = renderProvider();
    expect(store.getState().session.status).toBe(SessionStatus.SignedOut);
  });
});
