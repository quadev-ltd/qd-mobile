import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';

import { RESEND_COOLDOWN_SECONDS } from './useVerifyEmail';
import { VerifyEmailScreen } from './VerifyEmailScreen';

import {
  refreshUser,
  sendVerificationEmail,
  signOut,
} from '@/core/firebase/auth';
import { type SessionUser } from '@/core/firebase/types';
import { authStateChanged } from '@/core/state/slices/sessionSlice';
import {
  type OnboardingParamList,
  type OnboardingScreen,
} from '@/screens/Routing/Onboarding/types';
import { getMockStore } from '@/util/mockStore';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/firebase/auth', () => ({
  refreshUser: jest.fn(),
  sendVerificationEmail: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}));
jest.mock('@/core/firebase/claims', () => ({
  getClaims: jest.fn(() => Promise.resolve({ paid: false, admin: false })),
}));

const user: SessionUser = {
  uid: 'uid-1',
  email: 'ada@example.com',
  emailVerified: false,
  displayName: null,
  providerIds: ['password'],
};

const navigation = {} as NativeStackNavigationProp<
  OnboardingParamList,
  OnboardingScreen.VerifyEmail
>;
const route = {
  params: { applicationName: 'QuaDev' },
} as RouteProp<OnboardingParamList, OnboardingScreen.VerifyEmail>;

const renderScreen = () => {
  const store = getMockStore({ user });
  render(
    <Provider store={store}>
      <VerifyEmailScreen navigation={navigation} route={route} />
    </Provider>,
  );
  return store;
};

describe('VerifyEmailScreen', () => {
  let onAppStateChange: (state: string) => void = () => undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((_type, listener) => {
        onAppStateChange = listener as (state: string) => void;
        return { remove: jest.fn() } as never;
      });
  });

  afterEach(() => jest.restoreAllMocks());

  it('moves the session on when the email is verified', async () => {
    const verified = { ...user, emailVerified: true };
    (refreshUser as jest.Mock).mockResolvedValue(verified);
    const store = renderScreen();
    await act(() => fireEvent.press(screen.getByTestId('verified-cta')));
    expect(refreshUser).toHaveBeenCalled();
    expect(store.getActions()).toContainEqual(authStateChanged(verified));
    expect(screen.queryByText('emailVerification.notVerifiedYet')).toBeNull();
  });

  it('says so when the email is not verified yet', async () => {
    (refreshUser as jest.Mock).mockResolvedValue(user);
    renderScreen();
    await act(() => fireEvent.press(screen.getByTestId('verified-cta')));
    expect(
      screen.getByText('emailVerification.notVerifiedYet'),
    ).toBeOnTheScreen();
  });

  it('checks again when the app returns to the foreground', async () => {
    (refreshUser as jest.Mock).mockResolvedValue(user);
    renderScreen();
    await act(async () => onAppStateChange('active'));
    expect(refreshUser).toHaveBeenCalledTimes(1);
    // A silent check does not show "not verified yet".
    expect(screen.queryByText('emailVerification.notVerifiedYet')).toBeNull();
  });

  it('resends the email, then starts the cooldown', async () => {
    jest.useFakeTimers();
    (sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);
    renderScreen();
    await act(() => fireEvent.press(screen.getByTestId('resend-cta')));
    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText('emailVerification.resendCooldown'),
    ).toBeOnTheScreen();

    // Pressing during the cooldown does nothing.
    await act(() => fireEvent.press(screen.getByTestId('resend-cta')));
    expect(sendVerificationEmail).toHaveBeenCalledTimes(1);

    for (let second = 0; second < RESEND_COOLDOWN_SECONDS; second++) {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
    }
    expect(screen.getByText('emailVerification.resendCTA')).toBeOnTheScreen();
    jest.useRealTimers();
  });

  it('shows the throttling error from Firebase', async () => {
    (sendVerificationEmail as jest.Mock).mockRejectedValue({
      code: 'auth/too-many-requests',
    });
    renderScreen();
    await act(() => fireEvent.press(screen.getByTestId('resend-cta')));
    expect(screen.getByText('error.tooManyRequestsError')).toBeOnTheScreen();
  });

  it('"Use another account" signs out', async () => {
    renderScreen();
    await act(() =>
      fireEvent.press(screen.getByText('emailVerification.changePathButton')),
    );
    expect(signOut).toHaveBeenCalled();
  });
});
