/* eslint-disable @typescript-eslint/no-var-requires, react/display-name -- jest.mock factories cannot use imports */
import { render, screen } from '@testing-library/react-native';
import { hide } from 'react-native-bootsplash';
import { Provider } from 'react-redux';

import Router from './Router';

import { SessionStatus } from '@/core/state/slices/sessionSlice';
import { getMockStore } from '@/util/mockStore';

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn(() => Promise.resolve()),
}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) =>
    children,
}));
jest.mock('@/components/AppLoading', () => {
  const { Text } = require('react-native');
  return () => <Text>loading</Text>;
});
jest.mock('./Private/AuthenticatedStack', () => {
  const { Text } = require('react-native');
  return () => <Text>private drawer</Text>;
});
jest.mock('./Public/UnauthenticatedStack', () => {
  const { Text } = require('react-native');
  return () => <Text>public stack</Text>;
});
jest.mock('./Onboarding/OnboardingStack', () => {
  const { Text } = require('react-native');
  return {
    OnboardingStack: ({ step }: { step: string }) => (
      <Text>{`onboarding ${step}`}</Text>
    ),
  };
});

const renderRouter = (status: SessionStatus, authResolved = true) =>
  render(
    <Provider store={getMockStore({ status, authResolved })}>
      <Router applicationName="QuaDev" environment="test" />
    </Provider>,
  );

describe('Router', () => {
  beforeEach(() => jest.clearAllMocks());

  it('keeps the splash until Firebase reports the session', () => {
    renderRouter(SessionStatus.Initializing, false);
    expect(screen.getByText('loading')).toBeOnTheScreen();
    expect(hide).not.toHaveBeenCalled();
  });

  it('hides the splash and shows the loading screen while the profile loads', () => {
    renderRouter(SessionStatus.Initializing, true);
    expect(screen.getByText('loading')).toBeOnTheScreen();
    expect(hide).toHaveBeenCalledWith({ fade: true });
  });

  it.each([
    [SessionStatus.SignedOut, 'public stack'],
    [SessionStatus.NeedsEmailVerification, 'onboarding VerifyEmail'],
    [SessionStatus.NeedsProfile, 'onboarding CompleteProfile'],
    [SessionStatus.Ready, 'private drawer'],
  ])('%s shows %s and hides the splash', (status, text) => {
    renderRouter(status);
    expect(screen.getByText(text)).toBeOnTheScreen();
    expect(hide).toHaveBeenCalledWith({ fade: true });
  });
});
