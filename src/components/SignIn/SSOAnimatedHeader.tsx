import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AnimatedCTA } from '../AnimatedCTA';

import { SSOSwitch } from './SSOSwitch';
import { type ScreenType } from './types';

import { colors } from '@/styles';

type SSOAnimatedHeaderProps = {
  screen: ScreenType;
  isSSOExpanded: boolean;
  switchSSO: () => void;
  handleFacebookSignIn: () => void;
  handleGoogleSignIn: () => void;
  onAnimationEnded?: () => void;
  disableAnimation?: boolean;
  safeAreaViewportHeight: number;
};

const COLLAPSED_CONTAINER_HEIGHT = 50;

export const SSO_COLLAPSE_FIRST_STAGE_DURATION = 700;

export const SSOAnimatedHeader: React.FC<SSOAnimatedHeaderProps> = ({
  screen,
  isSSOExpanded,
  switchSSO,
  handleFacebookSignIn,
  handleGoogleSignIn,
  onAnimationEnded,
  disableAnimation,
  safeAreaViewportHeight,
}) => {
  const { t } = useTranslation();
  const [isExpandedSecondAnimation, setIsExpandedSecondAnimation] =
    useState(isSSOExpanded);
  const [animatedHeight] = useState(new Animated.Value(safeAreaViewportHeight));
  const animateHeight = useCallback(() => {
    !disableAnimation &&
      Animated.timing(animatedHeight, {
        toValue: isSSOExpanded
          ? safeAreaViewportHeight
          : COLLAPSED_CONTAINER_HEIGHT,
        duration: SSO_COLLAPSE_FIRST_STAGE_DURATION,
        useNativeDriver: false, // 'height' is not supported by the native driver
      }).start(() => {
        setIsExpandedSecondAnimation(isSSOExpanded);
        onAnimationEnded && onAnimationEnded();
      });
  }, [
    isSSOExpanded,
    disableAnimation,
    onAnimationEnded,
    animatedHeight,
    safeAreaViewportHeight,
  ]);

  const ssoCollapseStarted = isExpandedSecondAnimation && !isSSOExpanded;
  const shoulHideSSOButtons = !isExpandedSecondAnimation || ssoCollapseStarted;
  return (
    <Animated.View style={[{ height: animatedHeight }, styles.headerContainer]}>
      <View style={styles.ssoButtonsContainer}>
        {isExpandedSecondAnimation && (
          <>
            <AnimatedCTA
              testID="facebook-cta"
              Icon={<Icon name="facebook" size={36} color={colors.white} />}
              text={t(`${screen}.withFacebook`)}
              accessibilityLabel={t(`${screen}.withFacebookAccessibilityLabel`)}
              style={styles.facebookButton}
              onPress={handleFacebookSignIn}
              hide={shoulHideSSOButtons}
              disableAnimation={disableAnimation}
            />
            <AnimatedCTA
              testID="google-cta"
              Icon={<Icon name="google" size={28} color={colors.grey} />}
              text={t(`${screen}.withGoogle`)}
              accessibilityLabel={t(`${screen}.withGoogleAccessibilityLabel`)}
              style={styles.googleButton}
              textStyle={{ color: colors.grey }}
              onPress={handleGoogleSignIn}
              hide={shoulHideSSOButtons}
              disableAnimation={disableAnimation}
            />
          </>
        )}
      </View>
      <SSOSwitch
        isSSOExpanded={isSSOExpanded}
        dividerLabel={t(`${screen}.withSSO`)}
        emailButtonLabel={t(`${screen}.withEmail`)}
        onPressSSO={switchSSO}
        onAnimationEnded={animateHeight}
        disableAnimation={disableAnimation}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 8,
  },
  ssoButtonsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  facebookButton: {
    backgroundColor: colors.facebookBlue,
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: colors.white,
    marginBottom: 20,
  },
});
