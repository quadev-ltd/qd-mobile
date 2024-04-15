import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, render } from '@testing-library/react-native';

import { Screen, type StackParamList } from '../Routing/types';

import { SignInScreen } from './SignInScreen';

import { ApplicationEnvironentEnum } from '@/core/env';

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NativeStackNavigationProp<
  StackParamList,
  Screen.SignIn,
  undefined
>;

const mockRoute = {
  params: {
    environment: ApplicationEnvironentEnum.Enum.dev,
  },
} as unknown as RouteProp<StackParamList, Screen.SignIn>;

jest.mock('../../components/SignIn/SSOAnimatedHeader.tsx');
jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);

describe('SignInScreen', () => {
  beforeEach(() => {
    (mockNavigation.navigate as jest.Mock).mockReset();
  });

  it('renders correctly', () => {
    const { queryByText } = render(
      <SignInScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(queryByText('signIn.changePathButton')).toBeVisible();
    expect(queryByText('signIn.firstNameLabel')).toBeNull();
  });

  it('navigates to the sign-in screen on change path action', async () => {
    const { getByText } = render(
      <SignInScreen navigation={mockNavigation} route={mockRoute} />,
    );

    await act(() => {
      fireEvent.press(getByText('signIn.changePathButton'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.SignUp);
  });
});
