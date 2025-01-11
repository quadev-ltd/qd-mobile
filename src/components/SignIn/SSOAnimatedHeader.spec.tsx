import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore, { type MockStoreEnhanced } from 'redux-mock-store';

import { SSOAnimatedHeader } from './SSOAnimatedHeader';
import { ScreenType } from './types';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);
jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
}));
jest.mock('@/core/sso/googleSSO', () => ({
  onGoogleSignIn: jest.fn(),
}));
jest.mock('@/core/api/hooks/useLoadUserProfile');

describe('SSOAnimatedHeader', () => {
  let store: MockStoreEnhanced<unknown>;
  const mockStore = configureMockStore();

  beforeEach(() => {
    store = mockStore({
      auth: {
        authToken: '',
      },
    });
  });
  const switchSSO = jest.fn();
  it('renders initial state correctly', () => {
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <SSOAnimatedHeader
          screen={ScreenType.SignIn}
          isSSOExpanded={true}
          disableAnimation={true}
          switchSSO={switchSSO}
          safeAreaViewportHeight={900}
          setIsLoading={jest.fn()}
          isLoading={false}
        />
      </Provider>,
    );
    expect(getByText('signIn.withGoogle')).toBeTruthy();
    expect(queryByText('signIn.withSSO')).toBeNull();
  });
});
