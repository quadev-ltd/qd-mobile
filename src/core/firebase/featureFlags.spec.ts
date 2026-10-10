import { doc, onSnapshot } from '@react-native-firebase/firestore';

import { watchFlagOverrides } from './featureFlags';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);

const snapshot = (data: Record<string, unknown> | undefined) => ({
  exists: () => data !== undefined,
  data: () => data,
});

describe('watchFlagOverrides', () => {
  let next: (value: unknown) => void;
  let fail: (error: unknown) => void;
  const unsubscribe = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (onSnapshot as jest.Mock).mockImplementation((_ref, onNext, onError) => {
      next = onNext;
      fail = onError;
      return unsubscribe;
    });
  });

  it('listens to featureFlags/{uid} and keeps only known boolean flags', () => {
    const onNext = jest.fn();
    const stop = watchFlagOverrides('uid-1', onNext, jest.fn());
    expect(doc).toHaveBeenCalledWith(
      expect.anything(),
      'featureFlags',
      'uid-1',
    );

    next(
      snapshot({
        smartInspection: true,
        aiDiagnostics: 'yes',
        updatedBy: 'admin',
      }),
    );
    expect(onNext).toHaveBeenLastCalledWith({ smartInspection: true });

    stop();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('reports no overrides when the document does not exist', () => {
    const onNext = jest.fn();
    watchFlagOverrides('uid-1', onNext, jest.fn());
    next(snapshot(undefined));
    expect(onNext).toHaveBeenLastCalledWith({});
  });

  it('passes listener errors on', () => {
    const onError = jest.fn();
    watchFlagOverrides('uid-1', jest.fn(), onError);
    const error = { code: 'firestore/permission-denied' };
    fail(error);
    expect(onError).toHaveBeenCalledWith(error);
  });
});
