import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PublicScreen, type StackParamList } from './types';

import ForgotPasswordScreen from '@/screens/ForgotPassword/ForgotPasswordScreen';
import LandingScreen from '@/screens/Landing/LandingScreen';
import SignInScreen from '@/screens/SignIn/SignInScreen';
import SignUpScreen from '@/screens/SignUp/SignUpScreen';

type UnauthenticatedStackProps = {
  environment?: string;
};

const Stack = createNativeStackNavigator<StackParamList>();
export const UnauthenticatedStack: React.FC<UnauthenticatedStackProps> = ({
  environment,
}) => {
  return (
    <Stack.Navigator
      initialRouteName={PublicScreen.Landing}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={PublicScreen.Landing}
        component={LandingScreen}
        initialParams={{ environment }}
      />
      <Stack.Screen name={PublicScreen.SignIn} component={SignInScreen} />
      <Stack.Screen name={PublicScreen.SignUp} component={SignUpScreen} />
      <Stack.Screen
        name={PublicScreen.ForgotPassword}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default UnauthenticatedStack;
