import { type TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import StatusDisplay from '../../components/StatusDisplay';

import Subtitle from './Subtitle';
import { type ResendRequestStatus, VerificationRequestStatus } from './types';
import { useEmailVerification } from './useEmailVerification';

import { CTA } from '@/components/CTA';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import Title from '@/components/SignIn/Title';
import { ScreenType } from '@/components/SignIn/types';
import { APIError } from '@/core/api/types';

const mapAPIErrorToFriendlyMessage = (
  t: TFunction<'translation'>,
  apiError: APIError,
) => {
  switch (apiError) {
    case APIError.EmailVerifiedError:
      return t('error.emailAlreadyVerifiedError');
    case APIError.TokenExpiredError:
      return t('error.tokenExpiredError');
    case APIError.InvalidTokenError:
    case APIError.InvalidUserIDError:
      return t('error.linkCorruptedError');
    case APIError.TooManyRequestsError:
      return t('error.tooManyRequestsError');
    case APIError.UnmanagedError:
      return t('error.networkOrServerError');
    default:
      return t('error.linkGeneralError');
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
        <Title text={title} accessibilityLabel={title} />
        <StatusDisplay status={finalStatus} />
        <Subtitle
          status={finalStatus}
          isDeepLinkedVerificationStage={isDeepLinkedVerificationStage}
        />
        {apiResendError && !isDeepLinkedVerificationStage && (
          <ErrorMessage
            text={mapAPIErrorToFriendlyMessage(t, apiResendError)}
            accessibilityLabel={mapAPIErrorToFriendlyMessage(t, apiResendError)}
          />
        )}
        {verificationStatus !== VerificationRequestStatus.Verified &&
          verificationStatus !== VerificationRequestStatus.Verifying &&
          apiVerificationError &&
          isDeepLinkedVerificationStage && (
            <ErrorMessage
              text={mapAPIErrorToFriendlyMessage(t, apiVerificationError)}
              accessibilityLabel={mapAPIErrorToFriendlyMessage(
                t,
                apiVerificationError,
              )}
            />
          )}
        <View style={styles.descriptionContainerText}>
          {![apiVerificationError, apiResendError].includes(
            APIError.EmailVerifiedError,
          ) &&
            !(verificationStatus === VerificationRequestStatus.Verified) && (
              <CTA
                style={styles.resendCTA}
                disabled={!displayButtons}
                text={t('emailVerification.resendCTA')}
                accessibilityLabel={t('emailVerification.resendCTA')}
                onPress={resendEmail}
              />
            )}
          <FooterPrompt
            changePath={goToSignIn}
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
  descriptionContainerText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  resendCTA: {
    marginBottom: 12,
  },
});

export default EmailVerification;
