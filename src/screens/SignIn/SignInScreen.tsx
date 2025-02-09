import { zodResolver } from '@hookform/resolvers/zod';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormProvider, useForm } from 'react-hook-form';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { SignInForm } from './SignInForm';

import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';
import {
  type SignInSchemaType,
  signInSchema,
  SignInFields,
} from '@/schemas/signInSchema';

export type SignInScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.SignIn
>;

export const SignInScreen: React.FC<SignInScreenProps> = ({
  route,
  navigation,
}) => {
  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  });
  const setFocusOnManualFormShow = () => {
    methods.setFocus(SignInFields.email);
  };
  const handleForgotPassword = (email?: string) =>
    navigation.navigate(PublicScreen.ForgotPassword, { email });

  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);

  return (
    <FormProvider {...methods}>
      <SSOAnimatedForm
        screen={ScreenType.SignIn}
        changePath={goToSignUp}
        formHeight={350}
        initiateManualSignIn={route.params?.manualSignIn}
        setFocusOnManualFormShow={setFocusOnManualFormShow}>
        <SignInForm forgotPasswordCallback={handleForgotPassword} />
      </SSOAnimatedForm>
    </FormProvider>
  );
};

export default SignInScreen;
