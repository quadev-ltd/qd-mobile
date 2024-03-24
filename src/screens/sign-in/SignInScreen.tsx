import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { Screen, type StackParamList } from '../routing/Router';

import { FormTextInput } from '@/components/FormTextInput';
import { Footer } from '@/components/sign-in/Footer';
import { Header } from '@/components/sign-in/Header';
import { ScreenType } from '@/components/sign-in/types';
import { colors } from '@/styles/common';

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
    <View style={styles.container}>
      <Header
        handleFacebookLogin={handleFacebookLogin}
        handleGoogleLogin={handleGoogleLogin}
        screen={ScreenType.SignIn}
      />
      <View style={styles.form}>
        <FormTextInput
          label={t('signIn.emailLabel')}
          accessibilityLabel={t('signIn.emailAccessibilityLabel')}
        />
        <FormTextInput
          label={t('signIn.passwordLabel')}
          forgotPasswordLabel={t('signIn.forgotButton')}
          forgotPasswordCallback={handleForgotPassword}
          accessibilityLabel={t('signIn.passwordAccessibilityLabel')}
        />
      </View>
      <Footer
        submit={handleSubmit}
        changePath={goToSignUp}
        screen={ScreenType.SignIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purpleBlue,
    paddingVertical: 70,
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  },
  form: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
