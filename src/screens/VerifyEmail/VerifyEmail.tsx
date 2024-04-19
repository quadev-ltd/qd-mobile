import { type TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import StatusDisplay from './StatusDisplay';
import Subtitle from './Subtitle';
import { type ResendRequestStatus, VerificationRequestStatus } from './types';
import { useEmailVerification } from './useEmailVerification';

import { CTA } from '@/components/CTA';
import FlatTextCTA from '@/components/FlatTextCTA';
import { Layout } from '@/components/SignIn/Layout';
import { APIError } from '@/core/api/constants';
import { colors } from '@/styles';

const mapAPIErrorToFriendlyMessage = (
  t: TFunction<'translation'>,
  apiError: APIError,
) => {
  switch (apiError) {
    case APIError.EmailVerifiedError:
      return t('emailVerification.emailAlreadyVerifiedError');
    case APIError.TokenExpiredError:
      return t('emailVerification.tokenExpiredError');
    case APIError.InvalidTokenError:
    case APIError.InvalidUserIDError:
      return t('emailVerification.linkCorruptedError');
    case APIError.TooManyRequestsError:
      return t('emailVerification.tooManyRequestsError');
    default:
      return t('emailVerification.generalErrorDescription');
  }
};

interface EmailVerificationProps {
  resendStatus: ResendRequestStatus;
  verificationStatus: VerificationRequestStatus;
  userName: string;
  applicationName: string;
  resendEmail: () => void;
  goToSignIn: () => void;
  apiResendError?: APIError;
  apiVerificationError?: APIError;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  resendStatus,
  verificationStatus,
  userName,
  applicationName,
  resendEmail,
  goToSignIn,
  apiResendError,
  apiVerificationError,
}) => {
  const { t } = useTranslation();
  const { isDeepLinkedVerificationStage, finalStatus, displayButtons } =
    useEmailVerification(verificationStatus, resendStatus);

  const title = `${t(
    'emailVerification.title',
  )} ${applicationName}${userName}!`;
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.heroConatiner} />
        <StatusDisplay status={finalStatus} />
        <Text style={styles.welcomeText} accessibilityLabel={title}>
          {title}
        </Text>
        <Subtitle
          status={finalStatus}
          isDeepLinkedVerificationStage={isDeepLinkedVerificationStage}
        />
        <View style={styles.descriptionContainerText}>
          {apiResendError && !isDeepLinkedVerificationStage && (
            <Text
              style={styles.error}
              accessibilityLabel={mapAPIErrorToFriendlyMessage(
                t,
                apiResendError,
              )}>
              {mapAPIErrorToFriendlyMessage(t, apiResendError)}
            </Text>
          )}
          {verificationStatus !== VerificationRequestStatus.Verified &&
            apiVerificationError &&
            isDeepLinkedVerificationStage && (
              <Text
                style={styles.error}
                accessibilityLabel={mapAPIErrorToFriendlyMessage(
                  t,
                  apiVerificationError,
                )}>
                {mapAPIErrorToFriendlyMessage(t, apiVerificationError)}
              </Text>
            )}
          {![apiVerificationError, apiResendError].includes(
            APIError.EmailVerifiedError,
          ) &&
            !(verificationStatus === VerificationRequestStatus.Verified) && (
              <CTA
                disabled={!displayButtons}
                text={t('emailVerification.resendCTA')}
                accessibilityLabel={t('emailVerification.resendCTA')}
                onPress={resendEmail}
              />
            )}
          <FlatTextCTA
            style={styles.signInFooter}
            text={t('emailVerification.signInCTA')}
            accessibilityLabel={t('emailVerification.signInCTA')}
            onPress={goToSignIn}
            disabled={!displayButtons}
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
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  heroConatiner: {
    flex: 1,
    position: 'relative',
  },
  welcomeText: {
    position: 'absolute',
    top: 40,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    marginBottom: 40,
  },
  descriptionContainerText: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  signInFooter: {
    fontSize: 16,
    marginTop: 32,
  },
  error: {
    fontSize: 16,
    color: colors.red,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
});

export default EmailVerification;
