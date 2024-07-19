import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CTA from '@/components/CTA';
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
      Icon={<Icon name="apple" size={36} color={colors.white} />}
      text={t(`${screen}.withApple`)}
      accessibilityLabel={t(`${screen}.withAppleAccessibilityLabel`)}
      style={styles.appleButton}
      onPress={handleAppleSignIn}
      hide={hide}
      disableAnimation={disableAnimation}
    />
  );
};

const styles = StyleSheet.create({
  appleButton: {
    backgroundColor: colors.black,
    marginBottom: 20,
  },
});

export default AppleSSOCTA;
