import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { type MockStoreEnhanced } from 'redux-mock-store';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { SignInScreen } from './SignInScreen';

import { ApplicationEnvironentEnum } from '@/core/env';
import { getMockStore } from '@/util/mockStore';

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NativeStackNavigationProp<
  StackParamList,
  PublicScreen.SignIn,
  undefined
>;

const mockRoute = {
  params: {
    environment: ApplicationEnvironentEnum.Enum.dev,
  },
} as unknown as RouteProp<StackParamList, PublicScreen.SignIn>;

jest.mock('../../components/SignIn/SSOAnimatedHeader.tsx');
jest.mock('@react-native-firebase/crashlytics');
jest.mock('@react-native-firebase/auth');
jest.mock('@react-native-vector-icons/material-design-icons/static', () => ({
  MaterialDesignIcons: 'MaterialDesignIcons',
}));
jest.mock('@/core/sso/googleSSO', () => ({
  requestGoogleIdentity: jest.fn(),
  signOutFromGoogle: jest.fn(),
  isGoogleCancellation: jest.fn(() => false),
}));
jest.mock('@/core/sso/appleSSO', () => ({
  requestAppleIdentity: jest.fn(),
  isAppleCancellation: jest.fn(() => false),
}));

describe('SignInScreen', () => {
  let store: MockStoreEnhanced<unknown>;

  beforeEach(() => {
    (mockNavigation.navigate as jest.Mock).mockReset();
    store = getMockStore();
  });

  it('renders correctly', () => {
    const { queryByText } = render(
      <Provider store={store}>
        <SignInScreen navigation={mockNavigation} route={mockRoute} />
      </Provider>,
    );
    expect(queryByText('signIn.changePathButton')).toBeVisible();
    expect(queryByText('signIn.firstNameLabel')).toBeNull();
  });

  it('navigates to the sign-in screen on change path action', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <SignInScreen navigation={mockNavigation} route={mockRoute} />
      </Provider>,
    );

    await act(() => {
      fireEvent.press(getByText('signIn.changePathButton'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      PublicScreen.SignUp,
      undefined,
      { pop: true },
    );
  });
});
