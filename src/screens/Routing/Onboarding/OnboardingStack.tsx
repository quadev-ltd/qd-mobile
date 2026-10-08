import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingScreen, type OnboardingParamList } from './types';

import CompleteProfileScreen from '@/screens/CompleteProfile/CompleteProfileScreen';
import VerifyEmailScreen from '@/screens/VerifyEmail/VerifyEmailScreen';

type OnboardingStackProps = {
  step: OnboardingScreen;
  applicationName: string;
};

const Stack = createNativeStackNavigator<OnboardingParamList>();

/** One screen at a time: the session status decides which step is shown. */
export const OnboardingStack: React.FC<OnboardingStackProps> = ({
  step,
  applicationName,
}) => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {step === OnboardingScreen.VerifyEmail ? (
      <Stack.Screen
        name={OnboardingScreen.VerifyEmail}
        component={VerifyEmailScreen}
        initialParams={{ applicationName }}
      />
    ) : (
      <Stack.Screen
        name={OnboardingScreen.CompleteProfile}
        component={CompleteProfileScreen}
      />
    )}
  </Stack.Navigator>
);

export default OnboardingStack;
