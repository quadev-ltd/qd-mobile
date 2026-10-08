import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { type MockStoreEnhanced } from 'redux-mock-store';

import { SSOAnimatedHeader } from './SSOAnimatedHeader';
import { ScreenType } from './types';

import { getMockStore } from '@/util/mockStore';

jest.mock('@react-native-vector-icons/material-design-icons/static', () => ({
  MaterialDesignIcons: 'MaterialDesignIcons',
}));
jest.mock('@react-native-firebase/crashlytics');
jest.mock('@react-native-firebase/auth');
jest.mock('@/core/sso/googleSSO', () => ({
  requestGoogleIdentity: jest.fn(),
  signOutFromGoogle: jest.fn(),
  isGoogleCancellation: jest.fn(() => false),
}));
jest.mock('@/core/sso/appleSSO', () => ({
  requestAppleIdentity: jest.fn(),
  isAppleCancellation: jest.fn(() => false),
}));

describe('SSOAnimatedHeader', () => {
  let store: MockStoreEnhanced<unknown>;

  beforeEach(() => {
    store = getMockStore();
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
    expect(getByText('signIn.withApple')).toBeTruthy();
    expect(queryByText('signIn.withSSO')).toBeNull();
  });
});
