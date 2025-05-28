import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import ResetPasswordForm from './ResetPasswordForm';

import BrandedTitle from '@/components/SignIn/BrandedTitle';
import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import { ScreenType } from '@/components/SignIn/types';

export type ResetPasswordScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.ResetPassword
>;

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const goToSignIn = () => navigation.navigate(PublicScreen.SignIn, {});
  const onSuccessGoToSignIn = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: PublicScreen.SignIn,
          params: {
            manualSignIn: true,
          },
        },
      ],
    });
  };
  const goToSignForgotPassword = () =>
    navigation.replace(PublicScreen.ForgotPassword, {});
  return (
    <Layout>
      <BrandedTitle
        text={t('resetPassword.title')}
        accessibilityLabel={t('resetPassword.title')}
      />
      <ResetPasswordForm
        userID={route.params.userID}
        verificationToken={route.params.verificationToken}
        sendAnotherResetLink={goToSignForgotPassword}
        onSuccessGoToSignIn={onSuccessGoToSignIn}
      />
      <FooterPrompt changePath={goToSignIn} screen={ScreenType.ResetPassword} />
    </Layout>
  );
};

export default ResetPasswordScreen;
