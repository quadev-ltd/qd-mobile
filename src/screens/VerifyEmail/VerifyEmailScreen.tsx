import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { type ResendStatus, useVerifyEmail } from './useVerifyEmail';

import CTA from '@/components/CTA';
import BrandedSubtitle from '@/components/SignIn/BrandedSubtitle';
import BrandedTitle from '@/components/SignIn/BrandedTitle';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import { ScreenType } from '@/components/SignIn/types';
import StatusDisplay, { VerificationStatus } from '@/components/StatusDisplay';
import { useSessionUser } from '@/core/session/hooks';
import { useAppSelector } from '@/core/state/hooks';
import { selectProfile } from '@/core/state/selectors/session';
import {
  type OnboardingParamList,
  type OnboardingScreen,
} from '@/screens/Routing/Onboarding/types';

export type VerifyEmailScreenProps = NativeStackScreenProps<
  OnboardingParamList,
  OnboardingScreen.VerifyEmail
>;

const statusFor = (
  isChecking: boolean,
  resendStatus: ResendStatus,
): VerificationStatus => {
  if (isChecking) return VerificationStatus.Verifying;
  if (resendStatus === 'sending') return VerificationStatus.Sending;
  if (resendStatus === 'sent') return VerificationStatus.Success;
  if (resendStatus === 'error') return VerificationStatus.Failure;
  return VerificationStatus.Pending;
};

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  route,
}) => {
  const { t } = useTranslation();
  const user = useSessionUser();
  const profile = useAppSelector(selectProfile);
  const {
    isChecking,
    notVerifiedYet,
    resendStatus,
    errorKey,
    cooldown,
    checkVerification,
    resendEmail,
    switchAccount,
  } = useVerifyEmail();

  const firstName = profile?.firstName ? ` ${profile.firstName}` : '';
  const title = `${t('emailVerification.title')} ${
    route.params?.applicationName ?? ''
  }${firstName}!`;
  const subtitle = `${t('emailVerification.emailSent', {
    email: user?.email ?? '',
  })}\n\n${t('emailVerification.emailVerificationInstructions')}`;
  const isBusy = isChecking || resendStatus === 'sending';
  const resendLabel =
    cooldown > 0
      ? t('emailVerification.resendCooldown', { seconds: cooldown })
      : t('emailVerification.resendCTA');
  const error = notVerifiedYet
    ? t('emailVerification.notVerifiedYet')
    : errorKey && t(errorKey);

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <BrandedTitle text={title} accessibilityLabel={title} />
          <StatusDisplay status={statusFor(isChecking, resendStatus)} />
          <BrandedSubtitle text={subtitle} accessibilityLabel={subtitle} />
          {error ? (
            <ErrorMessage text={error} accessibilityLabel={error} />
          ) : null}
        </ScrollView>
        <View style={styles.actions}>
          <CTA
            testID="verified-cta"
            style={styles.cta}
            disabled={isBusy}
            text={t('emailVerification.verifiedCTA')}
            accessibilityLabel={t('emailVerification.verifiedCTA')}
            onPress={checkVerification}
          />
          <CTA
            testID="resend-cta"
            style={styles.cta}
            disabled={isBusy || cooldown > 0}
            text={resendLabel}
            accessibilityLabel={resendLabel}
            onPress={resendEmail}
          />
          <FooterPrompt
            changePath={switchAccount}
            screen={ScreenType.EmailVerification}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignContent: 'stretch',
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  actions: {
    paddingTop: 12,
  },
  cta: {
    marginBottom: 12,
  },
});

export default VerifyEmailScreen;
