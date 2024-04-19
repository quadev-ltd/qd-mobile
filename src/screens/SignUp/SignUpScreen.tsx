import { type NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, type StackParamList } from '../Routing/types';

import { SignUpForm } from './SignUpForm';

import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';

export type SignUpScreenScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.SignUp
>;

const FORM_HEIGHT = 600;
export const SignUpScreen: React.FC<SignUpScreenScreenProps> = ({
  navigation,
}) => {
  const handleFacebookLogin = () => {};
  const handleGoogleLogin = () => {};
  const goToSignIn = () => navigation.navigate(Screen.SignIn);
  const handleSuccess = (userData: { userName: string; userID: string }) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: Screen.VerifyEmail,
          params: {
            firstName: userData.userName,
            userID: userData.userID,
          },
        },
      ],
    });
  };
  return (
    <SSOAnimatedForm
      screen={ScreenType.SignUp}
      handleFacebookAction={handleFacebookLogin}
      handleGoogleAction={handleGoogleLogin}
      formHeight={FORM_HEIGHT}
      changePath={goToSignIn}>
      <SignUpForm onSuccess={handleSuccess} />
    </SSOAnimatedForm>
  );
};
