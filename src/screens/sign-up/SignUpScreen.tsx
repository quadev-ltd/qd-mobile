import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import { Screen, type StackParamList } from '../routing/types';

import { CTA } from '@/components/CTA';
import { FormTextInput } from '@/components/FormTextInput';
import { commonStyles } from '@/components/sign-in/constants';
import { SSOAnimatedForm } from '@/components/sign-in/SSOAnimatedForm';
import { ScreenType } from '@/components/sign-in/types';
import { colors } from '@/styles/common';

export type SignUpScreenScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.SignUp
>;

const FORM_HEIGHT = 600;
export const SignUpScreen: React.FC<SignUpScreenScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const handleFacebookLogin = () => {};
  const handleGoogleLogin = () => {};
  const submit = () => {};
  const goToSignIn = () => navigation.navigate(Screen.SignIn);
  return (
    <SSOAnimatedForm
      screen={ScreenType.SignUp}
      handleFacebookAction={handleFacebookLogin}
      handleGoogleAction={handleGoogleLogin}
      formHeight={FORM_HEIGHT}
      changePath={goToSignIn}>
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
        secureTextEntry={true}
      />
      <FormTextInput
        label={t('signUp.passwordConfirmationLabel')}
        accessibilityLabel={t('signUp.passwordConfirmationAccessibilityLabel')}
        secureTextEntry={true}
      />
      <View style={styles.agreementContainer}>
        <View
          style={styles.checkbox}
          accessibilityLabel={t('signUp.termsAccessibilityLabel')}
        />
        <Text style={styles.agreementText} adjustsFontSizeToFit>
          {t('signUp.termsLabel')}
        </Text>
      </View>

      <View style={commonStyles.footerButton}>
        <CTA
          text={t(`signUp.submitButton`)}
          accessibilityLabel={t(`signUp.submitButtonAccessibilityLabel`)}
          onPress={submit}
        />
      </View>
    </SSOAnimatedForm>
  );
};

const styles = StyleSheet.create({
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
