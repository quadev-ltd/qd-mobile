import { t } from 'i18next';
import { View, StyleSheet } from 'react-native';

import StatusDisplay, {
  VerificationStatus,
} from '../../components/StatusDisplay';

import { CTA } from '@/components/CTA';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import Subtitle from '@/components/SignIn/Subtitle';

export interface ForgotPasswordStatusProps {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  hideStatus: () => void;
}

export const ForgotPasswordStatus: React.FC<ForgotPasswordStatusProps> = ({
  isLoading,
  isSuccess,
  isError,
  errorMessage,
  hideStatus,
}) => {
  return (
    <View style={styles.container}>
      {isLoading && (
        <>
          <StatusDisplay status={VerificationStatus.Sending} />
          <Subtitle
            text={t('forgotPassword.sending')}
            accessibilityLabel={t('forgotPassword.sendingAccessibilityLabel')}
          />
        </>
      )}
      {isSuccess && (
        <>
          <StatusDisplay status={VerificationStatus.Success} />
          <Subtitle
            text={t('forgotPassword.success')}
            accessibilityLabel={t('forgotPassword.success')}
          />
          <View style={styles.bodyContainer}>
            <CTA
              style={styles.cta}
              text={t('forgotPassword.repeat')}
              accessibilityLabel={t('forgotPassword.repeat')}
              onPress={hideStatus}
            />
          </View>
        </>
      )}
      {isError && (
        <>
          <StatusDisplay status={VerificationStatus.Failure} />
          <ErrorMessage
            text={errorMessage || t('forgotPassword.error')}
            accessibilityLabel={errorMessage || t('forgotPassword.error')}
          />
          <View style={styles.bodyContainer}>
            <CTA
              style={styles.cta}
              text={t('forgotPassword.tryAgain')}
              accessibilityLabel={t('forgotPassword.tryAgain')}
              onPress={hideStatus}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'stretch',
    flex: 1,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  cta: {
    marginBottom: 12,
  },
});

export default ForgotPasswordStatus;
