import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, render } from '@testing-library/react-native';

import { Screen, type StackParamList } from '../routing/types';

import { SignUpScreen } from './SignUpScreen';

import { ApplicationEnvironentEnum } from '@/core/env';

const mockNavigation = {
  navigate: jest.fn(),
} as unknown as NativeStackNavigationProp<
  StackParamList,
  Screen.SignUp,
  undefined
>;

const mockRoute = {
  params: {
    environment: ApplicationEnvironentEnum.Enum.dev,
  },
} as unknown as RouteProp<StackParamList, Screen.SignUp>;

jest.mock('../../components/sign-in/SSOHeader.tsx');

describe('SignUpScreen', () => {
  beforeEach(() => {
    (mockNavigation.navigate as jest.Mock).mockReset();
  });

  it('renders correctly', () => {
    const { queryByText } = render(
      <SignUpScreen navigation={mockNavigation} route={mockRoute} />,
    );
    expect(queryByText('signUp.changePathButton')).toBeVisible();
    expect(queryByText('signUp.firstNameLabel')).toBeNull();
  });

  it('navigates to the sign-in screen on change path action', () => {
    const { getByText } = render(
      <SignUpScreen navigation={mockNavigation} route={mockRoute} />,
    );
    act(() => {
      fireEvent.press(getByText('signUp.changePathButton'));
    });
    expect(mockNavigation.navigate).toHaveBeenCalledWith(Screen.SignIn);
  });
});
