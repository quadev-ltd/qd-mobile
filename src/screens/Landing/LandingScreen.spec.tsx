import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { render, screen } from '@testing-library/react-native';

import {
  type PublicScreen,
  type StackParamList,
} from '../Routing/Public/types';

import { LandingScreen } from './LandingScreen';

import { ApplicationEnvironentEnum } from '@/core/env';

// Mock navigation and route props
const mockNavigation = {
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    environment: ApplicationEnvironentEnum.Enum.dev,
  },
};

describe('LandingScreen', () => {
  it('shows the correct environment value', () => {
    render(
      <LandingScreen
        navigation={
          mockNavigation as unknown as NativeStackNavigationProp<
            StackParamList,
            PublicScreen.Landing,
            undefined
          >
        }
        route={
          mockRoute as unknown as RouteProp<
            StackParamList,
            PublicScreen.Landing
          >
        }
      />,
    );
    expect(screen.getByText('landing.changePathDescription')).toBeOnTheScreen();
  });
});
