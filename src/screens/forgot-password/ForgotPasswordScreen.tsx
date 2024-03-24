import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { type Screen, type StackParamList } from '../routing/types';

import { FormTextInput } from '@/components/FormTextInput';
import { Divider } from '@/components/sign-in/Divider';
import { Footer } from '@/components/sign-in/Footer';
import { ScreenType } from '@/components/sign-in/types';
import { colors } from '@/styles/common';

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
    <View style={styles.container}>
      <Divider label={t('forgotPassword.title')} />
      <View style={styles.form}>
        <FormTextInput
          label={t('signIn.emailLabel')}
          accessibilityLabel={t('signIn.emailAccessibilityLabel')}
        />
      </View>
      <Footer
        submit={handleSubmit}
        changePath={goToSignIn}
        screen={ScreenType.ForgotPassword}
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
