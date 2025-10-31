import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import ForgotPasswordForm from './ForgotPasswordForm';

import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import Title from '@/components/SignIn/Title';
import { ScreenType } from '@/components/SignIn/types';

export type ForgotPasswordScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.ForgotPassword
>;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);

  return (
    <Layout>
      <Title
        text={t('forgotPassword.title')}
        accessibilityLabel={t('forgotPassword.title')}
      />
      <ForgotPasswordForm
        emailLabel={t('forgotPassword.emailLabel')}
        emailAccessibilityLabel={t('forgotPassword.emailAccessibilityLabel')}
        submitLabel={t('forgotPassword.submitButton')}
        submitAccessibilityLabel={t(
          'forgotPassword.submitButtonAccessibilityLabel',
        )}
        defaultEmail={route.params?.email || ''}
      />
      <FooterPrompt
        changePath={goToSignUp}
        screen={ScreenType.ForgotPassword}
      />
    </Layout>
  );
};

export default ForgotPasswordScreen;
