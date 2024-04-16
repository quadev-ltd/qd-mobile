import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ForgotPasswordScreen } from '../ForgotPassword/ForgotPasswordScreen';
import { LandingScreen } from '../Landing/LandingScreen';
import { SignInScreen } from '../SignIn/SignInScreen';
import { SignUpScreen } from '../SignUp/SignUpScreen';
import VerifyEmailScreen from '../VerifyEmail/VerifyEmailScreen';
import { WelcomeScreen } from '../Welcome/WelcomeScreen';

import { Screen, type StackParamList } from './types';

import { linking } from '@/core/deepLinking';

type RouterProps = {
  environment?: string;
  applicationName: string;
};

const Stack = createNativeStackNavigator<StackParamList>();
export const Router: React.FC<RouterProps> = ({
  environment,
  applicationName,
}) => {
  return (
    <NavigationContainer linking={linking}>
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
        <Stack.Screen
          name={Screen.Wellcome}
          component={WelcomeScreen}
          initialParams={{ applicationName }}
        />
        <Stack.Screen name={Screen.VerifyEmail} component={VerifyEmailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
