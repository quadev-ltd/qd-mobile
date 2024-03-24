import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import { Screen, type StackParamList } from '../routing/Router';

import { FormTextInput } from '@/components/FormTextInput';
import { Footer } from '@/components/sign-in/Footer';
import { Header } from '@/components/sign-in/Header';
import { ScreenType } from '@/components/sign-in/types';
import { colors } from '@/styles/common';

export type SignUpScreenScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.SignUp
>;

export const SignUpScreen: React.FC<SignUpScreenScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const handleFacebookLogin = () => {};
  const handleGoogleLogin = () => {};
  const submit = () => {};
  const goToSignIn = () => navigation.navigate(Screen.SignIn);
  return (
    <View style={styles.mainContainer}>
      <Header
        handleFacebookLogin={handleFacebookLogin}
        handleGoogleLogin={handleGoogleLogin}
        screen={ScreenType.SignUp}
      />
      <View style={styles.form}>
        <FormTextInput
          label={t('signUp.emailLabel')}
          accessibilityLabel={t('signUp.emailAccessibilityLabel')}
        />
        <FormTextInput
          label={t('signUp.firstNameLabel')}
          accessibilityLabel={t('signUp.firstNameAccessibilityLabel')}
        />
        <FormTextInput
          label={t('signUp.lastNameLabel')}
          accessibilityLabel={t('signUp.lastNameAccessibilityLabel')}
        />
        <FormTextInput
          label={t('signUp.dobLabel')}
          accessibilityLabel={t('signUp.dobAccessibilityLabel')}
        />
        <FormTextInput
          label={t('signUp.passwordLabel')}
          accessibilityLabel={t('signUp.passwordAccessibilityLabel')}
        />
        {/* <FormTextInput label={t('signUp.passwordConfirmationLabel')} accessibilityLabel={t('signUp.passwordConfirmationAccessibilityLabel')}/> */}
        <View style={styles.agreementContainer}>
          <View
            style={styles.checkbox}
            accessibilityLabel={t('signUp.termsAccessibilityLabel')}
          />
          <Text style={styles.agreementText} adjustsFontSizeToFit>
            {t('signUp.termsLabel')}
          </Text>
        </View>
      </View>
      <Footer
        submit={submit}
        changePath={goToSignIn}
        screen={ScreenType.SignUp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.purpleBlue,
    paddingVertical: 70,
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'stretch',
    flex: 1,
  },
  form: {
    marginTop: 32,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  agreementContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.black,
    marginRight: 8,
  },
  agreementText: {
    flex: 1,
    fontSize: 12,
    alignSelf: 'center',
  },
});
