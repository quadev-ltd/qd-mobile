import configureMockStore from 'redux-mock-store';

import {
  initialSessionState,
  type SessionState,
} from '@/core/state/slices/sessionSlice';

/** A redux-mock-store with the session slice; it records dispatched actions for assertions. */
export const getMockStore = (session: Partial<SessionState> = {}) => {
  const mockStore = configureMockStore();
  return mockStore({
    session: { ...initialSessionState, ...session },
  });
};
