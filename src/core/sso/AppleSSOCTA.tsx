import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useLoadUserProfile } from '../api/hooks/useLoadUserProfile';
import { useAppSelector } from '../state/hooks';

import { onAppleSignIn } from './appleSSO';
import { useSSOSignIn } from './useSSOSignIn';

import CTA from '@/components/CTA';
import { MaterialIcon } from '@/components/MaterialIcon';
import { type ScreenType } from '@/components/SignIn/types';

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
  setIsLoading,
}) => {
  const authToken = useAppSelector(state => state.auth.authToken);
  useLoadUserProfile(authToken);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const { handleSignIn } = useSSOSignIn({
    dataErrorKey: 'error.appleSSODataError',
    setIsLoading,
    ssoFunction: onAppleSignIn,
  });

  return (
    <CTA
      isAnimated={true}
      testID="facebook-cta"
      Icon={
        <MaterialIcon
          style={styles.appleIcon}
          name="apple"
          size={36}
          color={colors.onPrimary}
        />
      }
      text={t(`${screen}.withApple`)}
      accessibilityLabel={t(`${screen}.withAppleAccessibilityLabel`)}
      style={[styles.appleButton, { backgroundColor: colors.primary }]}
      onPress={handleSignIn}
      hide={hide}
      disableAnimation={disableAnimation}
    />
  );
};

const styles = StyleSheet.create({
  appleButton: {
    marginBottom: 20,
  },
  appleIcon: {
    position: 'absolute',
    left: 16,
  },
});

export default AppleSSOCTA;
