import {
  activate,
  ensureInitialized,
  fetchAndActivate,
  getRemoteConfig,
  getValue,
  onConfigUpdate,
} from '@react-native-firebase/remote-config';

import { remoteConfig } from './app';
import { startRemoteConfig } from './remoteConfig';

import logger from '@/core/logger';

const mockLogger = { logError: jest.fn(), logMessage: jest.fn() };
jest.mock('@/core/logger', () => jest.fn(() => mockLogger));
jest.mock('./app', () => ({ remoteConfig: jest.fn() }));

// The instance from __mocks__: defaultConfig and settings are plain properties there.
const mockRemoteConfig = getRemoteConfig();

/** Server values: keys listed here read as source "remote", the rest as "default". */
let serverValues: Record<string, boolean> = {};

const flush = () => new Promise(resolve => setImmediate(resolve));

describe('startRemoteConfig', () => {
  let configUpdate: { next: () => void; error: (error: unknown) => void };
  const unsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    serverValues = {};
    mockRemoteConfig.defaultConfig = {};
    (remoteConfig as jest.Mock).mockReturnValue(mockRemoteConfig);
    (getValue as jest.Mock).mockImplementation((_config, key: string) => ({
      getSource: () => (key in serverValues ? 'remote' : 'default'),
      asBoolean: () => serverValues[key] ?? false,
    }));
    (onConfigUpdate as jest.Mock).mockImplementation((_config, observer) => {
      configUpdate = observer;
      return unsubscribe;
    });
  });

  it('sets the registry defaults and the fetch interval, then publishes server values only', async () => {
    serverValues = { smartInspection: true };
    const onValues = jest.fn();
    startRemoteConfig(onValues, { minimumFetchIntervalMillis: 3600000 });

    expect(mockRemoteConfig.defaultConfig).toEqual({
      smartInspection: false,
      interviewAssistant: false,
      aiDiagnostics: false,
    });
    expect(mockRemoteConfig.settings).toEqual({
      minimumFetchIntervalMillis: 3600000,
      fetchTimeoutMillis: 30000,
    });

    await flush();
    expect(ensureInitialized).toHaveBeenCalled();
    expect(fetchAndActivate).toHaveBeenCalled();
    expect(onValues).toHaveBeenLastCalledWith({ smartInspection: true });
  });

  it('activates and publishes real-time updates until stopped', async () => {
    const onValues = jest.fn();
    const stop = startRemoteConfig(onValues, { minimumFetchIntervalMillis: 0 });
    await flush();
    expect(onValues).toHaveBeenLastCalledWith({});

    serverValues = { interviewAssistant: true };
    configUpdate.next();
    await flush();
    expect(activate).toHaveBeenCalled();
    expect(onValues).toHaveBeenLastCalledWith({ interviewAssistant: true });

    stop();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('keeps the defaults when the fetch fails, logging a breadcrumb only', async () => {
    (fetchAndActivate as jest.Mock).mockRejectedValueOnce({
      code: 'remoteConfig/failure',
    });
    const onValues = jest.fn();
    startRemoteConfig(onValues, { minimumFetchIntervalMillis: 0 });
    await flush();
    expect(onValues).toHaveBeenLastCalledWith({});
    expect(logger().logMessage).toHaveBeenCalledWith(
      expect.stringContaining('fetchAndActivate failed'),
    );
    expect(logger().logError).not.toHaveBeenCalled();
    // Real-time updates still start, so a later change can arrive.
    expect(onConfigUpdate).toHaveBeenCalled();
  });

  it('does nothing with the emulators (no Remote Config emulator)', async () => {
    (remoteConfig as jest.Mock).mockReturnValue(null);
    const onValues = jest.fn();
    const stop = startRemoteConfig(onValues, { minimumFetchIntervalMillis: 0 });
    await flush();
    expect(fetchAndActivate).not.toHaveBeenCalled();
    expect(onValues).not.toHaveBeenCalled();
    stop();
  });

  it('never throws when the native module is missing', () => {
    (remoteConfig as jest.Mock).mockImplementation(() => {
      throw new Error('native module missing');
    });
    expect(() =>
      startRemoteConfig(jest.fn(), { minimumFetchIntervalMillis: 0 })(),
    ).not.toThrow();
  });

  it('publishes nothing after it was stopped', async () => {
    const onValues = jest.fn();
    startRemoteConfig(onValues, { minimumFetchIntervalMillis: 0 })();
    await flush();
    expect(onValues).not.toHaveBeenCalled();
    expect(onConfigUpdate).not.toHaveBeenCalled();
  });
});
