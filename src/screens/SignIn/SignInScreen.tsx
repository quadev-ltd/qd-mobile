import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { SignInForm } from './SignInForm';

import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';

export type SignInScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.SignIn
>;

export const SignInScreen: React.FC<SignInScreenProps> = ({
  route,
  navigation,
}) => {
  const handleForgotPassword = (email?: string) =>
    navigation.navigate(PublicScreen.ForgotPassword, { email });

  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);

  return (
    <SSOAnimatedForm
      screen={ScreenType.SignIn}
      changePath={goToSignUp}
      formHeight={350}
      initiateManualSignIn={route.params?.manualSignIn}>
      <SignInForm forgotPasswordCallback={handleForgotPassword} />
    </SSOAnimatedForm>
  );
};

export default SignInScreen;
