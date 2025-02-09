import { zodResolver } from '@hookform/resolvers/zod';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { FormProvider, useForm } from 'react-hook-form';
import { Platform } from 'react-native';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { SignUpForm } from './SignUpForm';

import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';
import {
  SignUpFields,
  signUpSchema,
  type SignUpSchemaType,
} from '@/schemas/signUpSchema';

export type SignUpScreenScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.SignUp
>;

const FORM_HEIGHT = 600;
export const SignUpScreen: React.FC<SignUpScreenScreenProps> = ({
  navigation,
}) => {
  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  });
  const setFocusOnHide = () => {
    methods.setFocus(SignUpFields.email);
  };
  const goToSignIn = () => navigation.navigate(PublicScreen.SignIn, {});
  const handleSuccess = (userData: { userName: string; userID: string }) => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: PublicScreen.VerifyEmail,
          params: {
            firstName: userData.userName,
            userID: userData.userID,
          },
        },
      ],
    });
  };
  return (
    <FormProvider {...methods}>
      <SSOAnimatedForm
        screen={ScreenType.SignUp}
        formHeight={FORM_HEIGHT}
        changePath={goToSignIn}
        setFocusOnManualFormShow={
          Platform.OS === 'android' ? setFocusOnHide : undefined
        }>
        <SignUpForm onSuccess={handleSuccess} />
      </SSOAnimatedForm>
    </FormProvider>
  );
};

export default SignUpScreen;
