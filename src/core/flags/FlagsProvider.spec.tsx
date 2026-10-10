import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { FlagsProvider, useFlag, useFlags } from './FlagsProvider';
import { type FlagValues } from './registry';

import { watchFlagOverrides } from '@/core/firebase/featureFlags';
import { startRemoteConfig } from '@/core/firebase/remoteConfig';
import logger from '@/core/logger';
import { useSessionUser } from '@/core/session/hooks';

const mockLogger = { logError: jest.fn(), logMessage: jest.fn() };
jest.mock('@/core/logger', () => jest.fn(() => mockLogger));
jest.mock('@/core/firebase/featureFlags', () => ({
  watchFlagOverrides: jest.fn(),
}));
jest.mock('@/core/firebase/remoteConfig', () => ({
  startRemoteConfig: jest.fn(),
}));
jest.mock('@/core/session/hooks', () => ({ useSessionUser: jest.fn() }));

const SmartInspection = () => (
  <Text>{`smartInspection=${String(useFlag('smartInspection'))}`}</Text>
);

describe('FlagsProvider', () => {
  let emitOverrides: (values: FlagValues) => void;
  let emitOverridesError: (error: unknown) => void;
  let emitRemote: (values: FlagValues) => void;
  const stopOverrides = jest.fn();
  const stopRemote = jest.fn();

  const signIn = (uid: string | null) =>
    (useSessionUser as jest.Mock).mockReturnValue(uid ? { uid } : null);

  beforeEach(() => {
    jest.clearAllMocks();
    signIn(null);
    (watchFlagOverrides as jest.Mock).mockImplementation(
      (_uid, onNext, onError) => {
        emitOverrides = onNext;
        emitOverridesError = onError;
        return stopOverrides;
      },
    );
    (startRemoteConfig as jest.Mock).mockImplementation(onValues => {
      emitRemote = onValues;
      return stopRemote;
    });
  });

  const renderProvider = () =>
    render(
      <FlagsProvider>
        <SmartInspection />
      </FlagsProvider>,
    );

  const expectSmartInspection = (value: boolean) =>
    expect(
      screen.getByText(`smartInspection=${String(value)}`),
    ).toBeOnTheScreen();

  it('uses the code defaults without a provider', () => {
    render(<SmartInspection />);
    expect(screen.getByText('smartInspection=false')).toBeOnTheScreen();
  });

  it('is off by default and starts Remote Config once, with no listener when signed out', () => {
    const { unmount } = renderProvider();
    expectSmartInspection(false);
    expect(startRemoteConfig).toHaveBeenCalledTimes(1);
    // The test environment fetches without a minimum interval.
    expect(startRemoteConfig).toHaveBeenCalledWith(expect.any(Function), {
      minimumFetchIntervalMillis: 0,
    });
    expect(watchFlagOverrides).not.toHaveBeenCalled();
    unmount();
    expect(stopRemote).toHaveBeenCalled();
  });

  it('follows Remote Config values', async () => {
    renderProvider();
    await act(async () => emitRemote({ smartInspection: true }));
    expect(screen.getByText('smartInspection=true')).toBeOnTheScreen();
    await act(async () => emitRemote({ smartInspection: false }));
    expect(screen.getByText('smartInspection=false')).toBeOnTheScreen();
  });

  it('lets the user override win over Remote Config, live', async () => {
    signIn('uid-1');
    renderProvider();
    expect(watchFlagOverrides).toHaveBeenCalledWith(
      'uid-1',
      expect.any(Function),
      expect.any(Function),
    );

    await act(async () => emitOverrides({ smartInspection: true }));
    expectSmartInspection(true);

    await act(async () => emitRemote({ smartInspection: true }));
    await act(async () => emitOverrides({ smartInspection: false }));
    expectSmartInspection(false);

    // Override cleared (or document missing): Remote Config decides again.
    await act(async () => emitOverrides({}));
    expectSmartInspection(true);
  });

  it('drops the overrides on sign-out and listens again for the next user', async () => {
    signIn('uid-1');
    const { rerender } = renderProvider();
    await act(async () => emitOverrides({ smartInspection: true }));
    expectSmartInspection(true);

    signIn(null);
    rerender(
      <FlagsProvider>
        <SmartInspection />
      </FlagsProvider>,
    );
    expect(stopOverrides).toHaveBeenCalledTimes(1);
    expectSmartInspection(false);

    // Same user again: the old overrides are not reused before the new snapshot arrives.
    signIn('uid-1');
    rerender(
      <FlagsProvider>
        <SmartInspection />
      </FlagsProvider>,
    );
    expect(watchFlagOverrides).toHaveBeenCalledTimes(2);
    expectSmartInspection(false);
  });

  it('falls back silently when the overrides cannot be read', async () => {
    signIn('uid-1');
    renderProvider();
    await act(async () => emitRemote({ smartInspection: true }));
    await act(async () => emitOverrides({ smartInspection: false }));
    expectSmartInspection(false);

    // Permission denied (e.g. rules not deployed yet): a breadcrumb, not a Crashlytics error.
    await act(async () =>
      emitOverridesError({ code: 'firestore/permission-denied' }),
    );
    expectSmartInspection(true);
    expect(logger().logMessage).toHaveBeenCalledWith(
      expect.stringContaining('uid=uid-1'),
    );
    expect(logger().logError).not.toHaveBeenCalled();

    await act(async () => emitOverridesError({ code: 'firestore/unknown' }));
    expect(logger().logError).toHaveBeenCalledWith(
      new Error('watchFlagOverrides failed: code=firestore/unknown uid=uid-1'),
    );
  });

  it('keeps the defaults when the listener cannot start', () => {
    signIn('uid-1');
    (watchFlagOverrides as jest.Mock).mockImplementation(() => {
      throw new Error('native module missing');
    });
    renderProvider();
    expectSmartInspection(false);
    expect(logger().logError).toHaveBeenCalled();
  });

  it('exposes every flag through useFlags', async () => {
    let flags: ReturnType<typeof useFlags> | undefined;
    const Probe = () => {
      flags = useFlags();
      return null;
    };
    render(
      <FlagsProvider>
        <Probe />
      </FlagsProvider>,
    );
    await act(async () => emitRemote({ interviewAssistant: true }));
    expect(flags).toEqual({
      smartInspection: false,
      interviewAssistant: true,
      aiDiagnostics: false,
    });
  });
});
