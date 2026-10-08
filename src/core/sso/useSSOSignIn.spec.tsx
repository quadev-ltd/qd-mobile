import { act, renderHook } from '@testing-library/react-native';
import { type ReactNode } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { useSSOSignIn } from './useSSOSignIn';

import { createProfileIfMissing } from '@/core/firebase/profile';
import {
  profileSetupFinished,
  profileSetupStarted,
  providerNamesReceived,
} from '@/core/state/slices/sessionSlice';
import { getMockStore } from '@/util/mockStore';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/firebase/profile', () => ({
  createProfileIfMissing: jest.fn(() => Promise.resolve(true)),
}));
jest.mock('./googleSSO', () => ({
  isGoogleCancellation: (error: { code?: string }) =>
    error?.code === 'SIGN_IN_CANCELLED',
}));
jest.mock('./appleSSO', () => ({
  isAppleCancellation: (error: { code?: string }) => error?.code === '1001',
}));

const result = {
  user: {
    uid: 'uid-1',
    email: null,
    emailVerified: true,
    displayName: null,
    providerIds: ['google.com'],
  },
  names: { firstName: 'Ada', lastName: 'L' },
};

const setup = (signIn: () => Promise<unknown>) => {
  const store = getMockStore();
  const setIsLoading = jest.fn();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result: hook } = renderHook(
    () =>
      useSSOSignIn({
        provider: 'google',
        setIsLoading,
        signIn: signIn as never,
      }),
    { wrapper },
  );
  return { store, setIsLoading, hook };
};

describe('useSSOSignIn', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates the profile from the provider names while holding the session', async () => {
    const { store, setIsLoading, hook } = setup(() => Promise.resolve(result));
    await act(() => hook.current.handleSignIn());
    expect(createProfileIfMissing).toHaveBeenCalledWith('uid-1', result.names);
    expect(store.getActions()).toEqual([
      profileSetupStarted(),
      providerNamesReceived(result.names),
      profileSetupFinished(),
    ]);
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('does nothing when the user cancels', async () => {
    const { hook } = setup(() => Promise.resolve(null));
    await act(() => hook.current.handleSignIn());
    expect(createProfileIfMissing).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('does not report an Apple cancellation', async () => {
    const { hook } = setup(() => Promise.reject({ code: '1001' }));
    await act(() => hook.current.handleSignIn());
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('shows the mapped error when the sign-in fails', async () => {
    const { store, hook } = setup(() =>
      Promise.reject({ code: 'auth/account-exists-with-different-credential' }),
    );
    await act(() => hook.current.handleSignIn());
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        text2: 'error.accountExistsWithDifferentCredential',
      }),
    );
    expect(store.getActions()).toContainEqual(profileSetupFinished());
  });

  it('stays quiet when only the profile write fails (CompleteProfile takes over)', async () => {
    (createProfileIfMissing as jest.Mock).mockRejectedValueOnce({
      code: 'firestore/permission-denied',
    });
    const { hook } = setup(() => Promise.resolve(result));
    await act(() => hook.current.handleSignIn());
    expect(Toast.show).not.toHaveBeenCalled();
  });
});
