import { useTranslation } from 'react-i18next';

import Subtitle from '@/components/SignIn/Subtitle';
import { VerificationStatus } from '@/components/StatusDisplay';

interface VerificationSubtitleProps {
  status?: VerificationStatus;
  isDeepLinkedVerificationStage: boolean;
}
const VerificationSubtitle: React.FC<VerificationSubtitleProps> = ({
  status,
  isDeepLinkedVerificationStage,
}) => {
  const { t } = useTranslation();
  let subtitle: string | undefined;

  if (!isDeepLinkedVerificationStage) {
    subtitle = `${t('emailVerification.emailSent')}\n\n${t(
      'emailVerification.emailVerificationInstructions',
    )}`;
  }

  if (status === VerificationStatus.Verifying) {
    subtitle = t('emailVerification.verifyingSubtitle');
  }

  if (status === VerificationStatus.Success && isDeepLinkedVerificationStage) {
    subtitle = t('emailVerification.successSubtitle');
  }

  const accessibilityLabel = subtitle;
  if (subtitle && accessibilityLabel) {
    return <Subtitle text={subtitle} accessibilityLabel={accessibilityLabel} />;
  }

  return null;
};

export default VerificationSubtitle;
