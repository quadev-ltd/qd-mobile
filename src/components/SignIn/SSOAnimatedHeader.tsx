import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import CTA from '../CTA';

import { SSOSwitch } from './SSOSwitch';
import { type ScreenType } from './types';

import { colors } from '@/styles/colors';

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
  const animatedHeight = useSharedValue(safeAreaViewportHeight);

  const animateHeight = useCallback(() => {
    if (!disableAnimation) {
      animatedHeight.value = withTiming(
        isSSOExpanded ? safeAreaViewportHeight : COLLAPSED_CONTAINER_HEIGHT,
        { duration: SSO_COLLAPSE_FIRST_STAGE_DURATION },
      );
      setTimeout(() => {
        setIsExpandedSecondAnimation(isSSOExpanded);
        onAnimationEnded && onAnimationEnded();
      }, SSO_COLLAPSE_FIRST_STAGE_DURATION);
    }
  }, [
    isSSOExpanded,
    disableAnimation,
    onAnimationEnded,
    animatedHeight,
    safeAreaViewportHeight,
  ]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      height: animatedHeight.value,
    }),
    [animatedHeight],
  );

  const ssoCollapseStarted = isExpandedSecondAnimation && !isSSOExpanded;
  const shoulHideSSOButtons = !isExpandedSecondAnimation || ssoCollapseStarted;

  return (
    <Animated.View style={[animatedStyle, styles.headerContainer]}>
      <View style={styles.ssoButtonsContainer}>
        {isExpandedSecondAnimation && (
          <>
            <CTA
              isAnimated={true}
              testID="facebook-cta"
              Icon={<Icon name="facebook" size={36} color={colors.white} />}
              text={t(`${screen}.withFacebook`)}
              accessibilityLabel={t(`${screen}.withFacebookAccessibilityLabel`)}
              style={styles.facebookButton}
              onPress={handleFacebookSignIn}
              hide={shoulHideSSOButtons}
              disableAnimation={disableAnimation}
            />
            <CTA
              isAnimated={true}
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

export default SSOAnimatedHeader;
