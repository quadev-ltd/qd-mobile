import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore, { type MockStoreEnhanced } from 'redux-mock-store';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { SignInScreen } from './SignInScreen';

import { ApplicationEnvironentEnum } from '@/core/env';

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
jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
}));
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);

const mockStore = configureMockStore();

describe('SignInScreen', () => {
  let store: MockStoreEnhanced<unknown>;

  beforeEach(() => {
    (mockNavigation.navigate as jest.Mock).mockReset();
    store = mockStore({
      auth: {
        authToken: '',
      },
    });
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

    expect(mockNavigation.navigate).toHaveBeenCalledWith(PublicScreen.SignUp);
  });
});
