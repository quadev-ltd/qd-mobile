import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { CTA } from '@/components/CTA';
import { FormTextInput } from '@/components/FormTextInput';
import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';

export type SignInScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.SignIn
>;

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const handleForgotPassword = () =>
    navigation.navigate(PublicScreen.ForgotPassword);
  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);
  const handleSubmit = () => {};
  const handleFacebookLogin = () => {};
  const handleGoogleLogin = () => {};
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
        <View style={styles.footerButton}>
          <CTA
            text={t(`signIn.submitButton`)}
            accessibilityLabel={t(`signIn.submitButtonAccessibilityLabel`)}
            onPress={handleSubmit}
          />
        </View>
      </SSOAnimatedForm>
    </TouchableWithoutFeedback>
  );
};

export const styles = StyleSheet.create({
  footerButton: {
    marginBottom: 12,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'stretch',
  },
});

export default SignInScreen;
