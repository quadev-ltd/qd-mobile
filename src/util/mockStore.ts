import configureMockStore from 'redux-mock-store';

import { AccountStatus } from '@/core/state/slices/types';

export const getMockStore = () => {
  const mockStore = configureMockStore();
  const store = mockStore({
    auth: {
      authToken: '',
    },
    user: {
      accountStatus: AccountStatus.Unverified,
    },
  });
  return store;
};
