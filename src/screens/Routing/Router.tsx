import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '../ForgotPassword/ForgotPasswordScreen';
import { LandingScreen } from '../Landing/LandingScreen';
import { SignInScreen } from '../SignIn/SignInScreen';
import { SignUpScreen } from '../SignUp/SignUpScreen';

import { Screen, type StackParamList } from './types';

type RouterProps = {
  environment?: string;
};

const Stack = createNativeStackNavigator<StackParamList>();
export const Router: React.FC<RouterProps> = ({ environment }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Screen.Landing}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name={Screen.Landing}
          component={LandingScreen}
          initialParams={{ environment }}
        />
        <Stack.Screen name={Screen.SignIn} component={SignInScreen} />
        <Stack.Screen name={Screen.SignUp} component={SignUpScreen} />
        <Stack.Screen
          name={Screen.ForgotPassword}
          component={ForgotPasswordScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
