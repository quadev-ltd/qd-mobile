import { getAuth, getIdTokenResult } from '@react-native-firebase/auth';

import { getClaims } from './claims';

const authState = getAuth() as unknown as { currentUser: unknown };

describe('getClaims', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authState.currentUser = null;
  });

  it('returns no claims when signed out', async () => {
    await expect(getClaims()).resolves.toEqual({ paid: false, admin: false });
    expect(getIdTokenResult).not.toHaveBeenCalled();
  });

  it('reads paid and admin from the ID token, forcing a refresh on request', async () => {
    const user = { uid: 'uid-1' };
    authState.currentUser = user;
    (getIdTokenResult as jest.Mock).mockResolvedValue({
      claims: { paid: true, admin: 'yes' },
    });
    await expect(getClaims(true)).resolves.toEqual({
      paid: true,
      admin: false,
    });
    expect(getIdTokenResult).toHaveBeenCalledWith(user, true);
  });
});
