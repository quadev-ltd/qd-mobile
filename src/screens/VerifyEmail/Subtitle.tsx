import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

import { VerificationScreenStatus } from './types';

import { colors } from '@/styles';

interface SubtitleProps {
  status?: VerificationScreenStatus;
  isDeepLinkedVerificationStage: boolean;
}
const Subtitle: React.FC<SubtitleProps> = ({
  status,
  isDeepLinkedVerificationStage,
}) => {
  const { t } = useTranslation();
  if (!isDeepLinkedVerificationStage) {
    const subtitle = `${t('emailVerification.emailSent')}\n\n${t(
      'emailVerification.emailVerificationInstructions',
    )}`;
    return (
      <Text accessibilityLabel={subtitle} style={styles.subtitle}>
        {subtitle}
      </Text>
    );
  }
  if (status === VerificationScreenStatus.Verifying) {
    <Text
      accessibilityLabel={t('emailVerification.verifyingSubtitle')}
      style={styles.subtitle}>
      {t('emailVerification.verifyingSubtitle')}
    </Text>;
  }
  if (status === VerificationScreenStatus.Success) {
    <Text
      accessibilityLabel={t('emailVerification.successSubtitle')}
      style={styles.subtitle}>
      {t('emailVerification.successSubtitle')}
    </Text>;
  }
  return;
};

const styles = StyleSheet.create({
  subtitle: {
    position: 'absolute',
    top: 300,
    fontSize: 16,
    paddingHorizontal: 0,
    paddingBottom: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    lineHeight: 24,
  },
});

export default Subtitle;
