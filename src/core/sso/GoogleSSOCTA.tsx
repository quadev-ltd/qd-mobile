import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { signInWithGoogle } from '../firebase/auth';

import { useSSOSignIn } from './useSSOSignIn';

import CTA from '@/components/CTA';
import { MaterialIcon } from '@/components/MaterialIcon';
import { type ScreenType } from '@/components/SignIn/types';

interface GoogleSSOCTAProps {
  hide: boolean;
  disableAnimation: boolean;
  screen: ScreenType;
  setIsLoading: (isLoading: boolean) => void;
}

const GoogleSSOCTA: React.FC<GoogleSSOCTAProps> = ({
  hide,
  disableAnimation,
  screen,
  setIsLoading,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const { handleSignIn } = useSSOSignIn({
    provider: 'google',
    setIsLoading,
    signIn: signInWithGoogle,
  });

  return (
    <CTA
      isAnimated={true}
      testID="google-cta"
      Icon={
        <MaterialIcon
          style={styles.googleIcon}
          name="google"
          size={28}
          color={colors.onTertiary}
        />
      }
      text={t(`${screen}.withGoogle`)}
      accessibilityLabel={t(`${screen}.withGoogleAccessibilityLabel`)}
      style={[styles.googleButton, { backgroundColor: colors.tertiary }]}
      textStyle={{ color: colors.onTertiary }}
      onPress={handleSignIn}
      hide={hide}
      disableAnimation={disableAnimation}
    />
  );
};

const styles = StyleSheet.create({
  googleButton: {
    marginBottom: 20,
  },
  googleIcon: {
    position: 'absolute',
    left: 16,
  },
});

export default GoogleSSOCTA;
