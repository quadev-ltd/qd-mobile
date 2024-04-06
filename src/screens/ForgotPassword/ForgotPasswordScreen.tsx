import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { type Screen, type StackParamList } from '../Routing/types';

import { CTA } from '@/components/CTA';
import { FormTextInput } from '@/components/FormTextInput';
import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import { TextDivider } from '@/components/SignIn/TextDivider';
import { ScreenType } from '@/components/SignIn/types';

export type ForgotPasswordScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.ForgotPassword
>;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const goToSignIn = () => navigation.goBack();
  const handleSubmit = () => {};
  return (
    <Layout>
      <TextDivider label={t('forgotPassword.title')} />
      <View style={styles.form}>
        <FormTextInput
          label={t('signIn.emailLabel')}
          accessibilityLabel={t('signIn.emailAccessibilityLabel')}
        />
        <CTA
          text={t('forgotPassword.submitButton')}
          accessibilityLabel={t(`signUp.submitButtonAccessibilityLabel`)}
          onPress={handleSubmit}
        />
      </View>
      <FooterPrompt
        changePath={goToSignIn}
        screen={ScreenType.ForgotPassword}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 20,
    alignContent: 'stretch',
    flex: 1,
  },
});
