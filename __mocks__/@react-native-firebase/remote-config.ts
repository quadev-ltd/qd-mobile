// Jest mock for the React Native Firebase v26 modular Remote Config API.
// `defaultConfig` and `settings` are plain properties, as on the real instance.
export const mockRemoteConfig: {
  defaultConfig: Record<string, string | number | boolean>;
  settings: { minimumFetchIntervalMillis: number; fetchTimeoutMillis: number };
} = {
  defaultConfig: {},
  settings: { minimumFetchIntervalMillis: 43200000, fetchTimeoutMillis: 60000 },
};

export const getRemoteConfig = jest.fn(() => mockRemoteConfig);
export const ensureInitialized = jest.fn(() => Promise.resolve());
export const fetchAndActivate = jest.fn(() => Promise.resolve(true));
export const activate = jest.fn(() => Promise.resolve(true));
// Every key reads as "static" (unset) unless a test overrides the implementation.
export const getValue = jest.fn((_config: unknown, _key: string) => ({
  getSource: () => 'static',
  asBoolean: () => false,
  asNumber: () => 0,
  asString: () => '',
}));
export const onConfigUpdate = jest.fn(() => jest.fn());
