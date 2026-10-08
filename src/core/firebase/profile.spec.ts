import {
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@react-native-firebase/firestore';

import {
  createProfile,
  createProfileIfMissing,
  displayDateToIso,
  isoDateToDisplay,
  normaliseName,
  saveProfile,
  updateProfile,
  watchProfile,
} from './profile';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);

const snapshot = (data?: object, fromCache = false) => ({
  exists: () => data !== undefined,
  data: () => data,
  metadata: { fromCache },
});

describe('date conversion (strings only)', () => {
  it('converts DD/MM/YYYY to YYYY-MM-DD and back', () => {
    expect(displayDateToIso('29/02/2024')).toBe('2024-02-29');
    expect(isoDateToDisplay('2024-02-29')).toBe('29/02/2024');
    expect(isoDateToDisplay(displayDateToIso('01/12/1990'))).toBe('01/12/1990');
  });

  it('does not shift the day with the time zone', () => {
    expect(displayDateToIso('31/12/1999')).toBe('1999-12-31');
    expect(displayDateToIso('01/01/2000')).toBe('2000-01-01');
  });

  it.each(['1/2/2000', '2000-01-01', '01/01/00', ''])('rejects %s', value => {
    expect(() => displayDateToIso(value)).toThrow('Invalid date format');
  });

  it('rejects malformed ISO dates', () => {
    expect(() => isoDateToDisplay('01/01/2000')).toThrow('Invalid date format');
  });
});

describe('normaliseName', () => {
  it('trims, cuts to 30 characters and drops empty names', () => {
    expect(normaliseName('  Ada ')).toBe('Ada');
    expect(normaliseName('x'.repeat(40))).toHaveLength(30);
    expect(normaliseName('   ')).toBeUndefined();
    expect(normaliseName(null)).toBeUndefined();
  });
});

describe('profile writes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates users/{uid} with a server timestamp and no date of birth when empty', async () => {
    await createProfile('uid-1', { firstName: 'Ada', lastName: 'Lovelace' });
    expect(setDoc).toHaveBeenCalledWith(
      { path: 'users/uid-1' },
      { firstName: 'Ada', lastName: 'Lovelace', createdAt: 'SERVER_TIMESTAMP' },
    );
    expect(serverTimestamp).toHaveBeenCalled();
  });

  it('includes the date of birth when given', async () => {
    await createProfile('uid-1', {
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1815-12-10',
    });
    expect((setDoc as jest.Mock).mock.calls[0][1]).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1815-12-10',
      createdAt: 'SERVER_TIMESTAMP',
    });
  });

  it('removes the date of birth with deleteField and never touches createdAt', async () => {
    await updateProfile('uid-1', { firstName: 'Ada', dateOfBirth: null });
    expect(updateDoc).toHaveBeenCalledWith(
      { path: 'users/uid-1' },
      { firstName: 'Ada', dateOfBirth: 'DELETE_FIELD' },
    );
  });

  it('saveProfile updates an existing document instead of recreating it', async () => {
    (getDoc as jest.Mock).mockResolvedValue(
      snapshot({ firstName: '', lastName: 'L' }),
    );
    await saveProfile('uid-1', { firstName: 'Ada', lastName: 'Lovelace' });
    expect(updateDoc).toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('saveProfile creates a missing document', async () => {
    (getDoc as jest.Mock).mockResolvedValue(snapshot());
    await saveProfile('uid-1', { firstName: 'Ada', lastName: 'Lovelace' });
    expect(setDoc).toHaveBeenCalled();
  });
});

describe('createProfileIfMissing (Google / Apple)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates the profile from the provider names, without a date of birth', async () => {
    (getDoc as jest.Mock).mockResolvedValue(snapshot());
    await expect(
      createProfileIfMissing('uid-1', { firstName: ' Ada ', lastName: 'L' }),
    ).resolves.toBe(true);
    expect((setDoc as jest.Mock).mock.calls[0][1]).toEqual({
      firstName: 'Ada',
      lastName: 'L',
      createdAt: 'SERVER_TIMESTAMP',
    });
  });

  it('leaves an existing profile alone', async () => {
    (getDoc as jest.Mock).mockResolvedValue(
      snapshot({ firstName: 'Ada', lastName: 'L' }),
    );
    await expect(createProfileIfMissing('uid-1', {})).resolves.toBe(true);
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('returns false when the provider gave no last name (Apple after the first sign-in)', async () => {
    (getDoc as jest.Mock).mockResolvedValue(snapshot());
    await expect(
      createProfileIfMissing('uid-1', { firstName: 'Ada' }),
    ).resolves.toBe(false);
    expect(setDoc).not.toHaveBeenCalled();
  });
});

describe('watchProfile', () => {
  it('listens with metadata changes and skips a cache-only "missing" answer', () => {
    const onNext = jest.fn();
    watchProfile('uid-1', onNext, jest.fn());
    const [ref, options, next] = (onSnapshot as jest.Mock).mock.calls[0];
    expect(ref).toEqual({ path: 'users/uid-1' });
    expect(options).toEqual({ includeMetadataChanges: true });

    next(snapshot(undefined, true));
    expect(onNext).not.toHaveBeenCalled();

    next(snapshot(undefined, false));
    expect(onNext).toHaveBeenLastCalledWith(null);

    next(snapshot({ firstName: 'Ada', lastName: 'L', dateOfBirth: 7 }, true));
    expect(onNext).toHaveBeenLastCalledWith({
      firstName: 'Ada',
      lastName: 'L',
    });
  });

  it('reports listener errors', () => {
    const onError = jest.fn();
    watchProfile('uid-1', jest.fn(), onError);
    const errorCallback = (onSnapshot as jest.Mock).mock.calls.at(-1)[3];
    errorCallback({ code: 'firestore/permission-denied' });
    expect(onError).toHaveBeenCalled();
  });
});
