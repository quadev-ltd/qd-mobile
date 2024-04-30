import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import StatusContainer from './StatusContainer';

import { CTA } from '@/components/CTA';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import Subtitle from '@/components/SignIn/Subtitle';
import { VerificationStatus } from '@/components/StatusDisplay';

interface ResetPasswordStatusProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  sendAnotherResetLink: () => void;
  tryAgain: () => void;
}

const ResetPasswordStatus: React.FC<ResetPasswordStatusProps> = ({
  isLoading,
  isSuccess,
  isError,
  errorMessage,
  sendAnotherResetLink,
  tryAgain,
}) => {
  const { t } = useTranslation();

  if (isError && errorMessage) {
    return (
      <StatusContainer status={VerificationStatus.Failure}>
        <ErrorMessage text={errorMessage} accessibilityLabel={errorMessage} />
        {(errorMessage === t('error.linkCorruptedError') ||
          errorMessage === t('error.tokenExpiredError')) && (
          <CTA
            style={styles.postErrorCTA}
            text={t('resetPassword.sendAnotherLink')}
            accessibilityLabel={t('resetPassword.sendAnotherLink')}
            onPress={sendAnotherResetLink}
          />
        )}
        {errorMessage === t('error.networkError') && (
          <CTA
            style={styles.postErrorCTA}
            text={t('resetPassword.tryAgain')}
            accessibilityLabel={t('resetPassword.tryAgain')}
            onPress={tryAgain}
          />
        )}
      </StatusContainer>
    );
  }
  if (isSuccess) {
    return (
      <StatusContainer status={VerificationStatus.Success}>
        <Subtitle
          text={t('resetPassword.success')}
          accessibilityLabel={t('resetPassword.success')}
        />
      </StatusContainer>
    );
  }

  if (isLoading) {
    return <StatusContainer status={VerificationStatus.Verifying} />;
  }
  return null;
};

const styles = StyleSheet.create({
  postErrorCTA: {
    marginTop: 32,
    alignSelf: 'center',
  },
});

export default ResetPasswordStatus;
