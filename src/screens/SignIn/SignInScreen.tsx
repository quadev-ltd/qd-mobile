import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Screen, type StackParamList } from '../Routing/types';

import { CTA } from '@/components/CTA';
import { FormTextInput } from '@/components/FormTextInput';
import { commonStyles } from '@/components/SignIn/constants';
import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';

export type SignInScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.SignIn
>;

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const handleForgotPassword = () => navigation.navigate(Screen.ForgotPassword);
  const goToSignUp = () => navigation.navigate(Screen.SignUp);
  const handleSubmit = () => {};
  const handleFacebookLogin = () => {};
  const handleGoogleLogin = () => {};
  return (
    <SSOAnimatedForm
      screen={ScreenType.SignIn}
      handleFacebookAction={handleFacebookLogin}
      handleGoogleAction={handleGoogleLogin}
      changePath={goToSignUp}
      formHeight={350}>
      <FormTextInput
        label={t('signIn.emailLabel')}
        accessibilityLabel={t('signIn.emailAccessibilityLabel')}
      />
      <FormTextInput
        label={t('signIn.passwordLabel')}
        forgotPasswordLabel={t('signIn.forgotButton')}
        forgotPasswordCallback={handleForgotPassword}
        accessibilityLabel={t('signIn.passwordAccessibilityLabel')}
        secureTextEntry={true}
      />
      <View style={commonStyles.footerButton}>
        <CTA
          text={t(`signIn.submitButton`)}
          accessibilityLabel={t(`signIn.submitButtonAccessibilityLabel`)}
          onPress={handleSubmit}
        />
      </View>
    </SSOAnimatedForm>
  );
};
