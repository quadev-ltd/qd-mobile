import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import CTA from '@/components/CTA';
import { MaterialIcon } from '@/components/MaterialIcon';
import { type ScreenType } from '@/components/SignIn/types';
import { colors } from '@/styles/colors';

interface AppleSSOCTAProps {
  hide: boolean;
  disableAnimation: boolean;
  screen: ScreenType;
  setIsLoading: (isLoading: boolean) => void;
}

const AppleSSOCTA: React.FC<AppleSSOCTAProps> = ({
  hide,
  disableAnimation,
  screen,
}) => {
  const { t } = useTranslation();
  const handleAppleSignIn = () => {};
  return (
    <CTA
      isAnimated={true}
      testID="facebook-cta"
      Icon={<MaterialIcon name="facebook" size={36} color={colors.white} />}
      text={t(`${screen}.withFacebook`)}
      accessibilityLabel={t(`${screen}.withFacebookAccessibilityLabel`)}
      style={styles.appleButton}
      onPress={handleAppleSignIn}
      hide={hide}
      disableAnimation={disableAnimation}
    />
  );
};

const styles = StyleSheet.create({
  appleButton: {
    backgroundColor: colors.facebookBlue,
    marginBottom: 20,
  },
});

export default AppleSSOCTA;
