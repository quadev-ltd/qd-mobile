import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import AnimatedLogo from '../Logo/FadingLogo';
import Spinner from '../Spinner';

import { SSOSwitch } from './SSOSwitch';
import { type ScreenType } from './types';

import GoogleSSOCTA from '@/core/sso/GoogleSSOCTA';

type SSOAnimatedHeaderProps = {
  screen: ScreenType;
  isSSOExpanded: boolean;
  switchSSO: () => void;
  onAnimationEnded?: () => void;
  disableAnimation?: boolean;
  safeAreaViewportHeight: number;
  setIsLoading: (isLoading: boolean) => void;
  isLoading?: boolean;
};

const COLLAPSED_CONTAINER_HEIGHT = 50;
export const SSO_COLLAPSE_FIRST_STAGE_DURATION = 700;

export const SSOAnimatedHeader: React.FC<SSOAnimatedHeaderProps> = ({
  screen,
  isSSOExpanded,
  switchSSO,
  onAnimationEnded,
  disableAnimation,
  safeAreaViewportHeight,
  setIsLoading,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [isExpandedSecondAnimation, setIsExpandedSecondAnimation] =
    useState(isSSOExpanded);
  const animatedHeight = useSharedValue(safeAreaViewportHeight);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
    }
  }, [hasMountedRef]);

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
      {isLoading && <Spinner />}
      <View
        style={[
          styles.ssoButtonsContainer,
          isLoading ? styles.hidden : styles.visible,
        ]}>
        {isExpandedSecondAnimation && (
          <>
            <AnimatedLogo
              isAnimated={hasMountedRef.current}
              style={styles.logo}
              show={!shoulHideSSOButtons && !isLoading}
            />
            <GoogleSSOCTA
              setIsLoading={setIsLoading}
              hide={shoulHideSSOButtons || !!isLoading}
              disableAnimation={Boolean(disableAnimation)}
              screen={screen}
            />
          </>
        )}
      </View>
      {!isLoading && (
        <SSOSwitch
          isSSOExpanded={isSSOExpanded}
          dividerLabel={t(`${screen}.withSSO`)}
          emailButtonLabel={t(`${screen}.withEmail`)}
          onPressSSO={switchSSO}
          onAnimationEnded={animateHeight}
          disableAnimation={disableAnimation}
        />
      )}
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
    justifyContent: 'flex-end',
  },
  logo: {
    width: 113,
    height: 140,
  },
  hidden: {
    display: 'none',
  },
  visible: {
    display: 'flex',
  },
});

export default SSOAnimatedHeader;
