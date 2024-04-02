import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';

import { AnimatedCTA } from '../AnimatedCTA';

import {
  FooterPromptHeight as FOOTER_PROMPT_HEIGHT,
  FooterPromptTopMargin as FOOTER_PROMPT_TOP_MARGIN,
  LayoutPaddingVertical as LAYOUT_PADDING_VERTICAL,
} from './constants';
import { SSOSwitch } from './SSOSwitch';
import { type ScreenType } from './types';

import { SvgFacebook } from '@/assets/svg/Facebook';
import { colors } from '@/styles/common';

const { height: VIEWPORT_HEIGHT } = Dimensions.get('window');

type SSOHeaderProps = {
  screen: ScreenType;
  isSSOExpanded: boolean;
  switchSSO: () => void;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
  onAnimationEnded?: () => void;
  isInitialAnimation?: boolean;
};

const COLLAPSED_CONTAINER_HEIGHT = 50;
const LAYOUT_CONTAINER_HEIGHT = VIEWPORT_HEIGHT - 2 * LAYOUT_PADDING_VERTICAL;
const HEADER_CONTAINER_BOTTOM_PADDING =
  FOOTER_PROMPT_HEIGHT + FOOTER_PROMPT_TOP_MARGIN;
export const SSO_COLLAPSE_FIRST_STAGE_DURATION = 700;
export const SSOHeader: React.FC<SSOHeaderProps> = ({
  screen,
  isSSOExpanded,
  switchSSO,
  handleFacebookLogin,
  handleGoogleLogin,
  onAnimationEnded,
  isInitialAnimation,
}) => {
  const { t } = useTranslation();
  const [isExpandedSecondAnimation, setIsExpandedSecondAnimation] =
    useState(isSSOExpanded);
  const [animatedHeight] = useState(
    new Animated.Value(LAYOUT_CONTAINER_HEIGHT),
  );
  const [animatedBottomMargin] = useState(
    new Animated.Value(HEADER_CONTAINER_BOTTOM_PADDING),
  );
  const animateHeight = () => {
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isSSOExpanded
          ? LAYOUT_CONTAINER_HEIGHT
          : COLLAPSED_CONTAINER_HEIGHT,
        duration: SSO_COLLAPSE_FIRST_STAGE_DURATION,
        useNativeDriver: false, // 'height' is not supported by the native driver
      }),
      Animated.timing(animatedBottomMargin, {
        toValue: isSSOExpanded ? HEADER_CONTAINER_BOTTOM_PADDING : 0,
        duration: SSO_COLLAPSE_FIRST_STAGE_DURATION,
        useNativeDriver: false, // 'margin' is not supported by the native driver
      }),
    ]).start(() => {
      setIsExpandedSecondAnimation(isSSOExpanded);
      onAnimationEnded && onAnimationEnded();
    });
  };
  const shoulHideSSOButtons =
    !isExpandedSecondAnimation || (isExpandedSecondAnimation && !isSSOExpanded);
  return (
    <Animated.View
      style={{ height: animatedHeight, paddingBottom: animatedBottomMargin }}>
      <View style={styles.ssoButtonsContainer}>
        <AnimatedCTA
          SvgComponent={SvgFacebook}
          text={t(`${screen}.withGoogle`)}
          style={styles.facebookButton}
          onPress={handleFacebookLogin}
          hide={shoulHideSSOButtons}
          isInitialAnimation={isInitialAnimation}
        />
        <AnimatedCTA
          source={require('../../assets/png/google.png')}
          text={t(`${screen}.withGoogle`)}
          style={styles.googleButton}
          textStyle={{ color: colors.grey }}
          onPress={handleGoogleLogin}
          hide={shoulHideSSOButtons}
          isInitialAnimation={isInitialAnimation}
        />
      </View>
      <SSOSwitch
        isSSOExpanded={isSSOExpanded}
        dividerLabel={t(`${screen}.withSSO`)}
        emailButtonLabel={t(`${screen}.withEmail`)}
        onPressSSO={switchSSO}
        onAnimationEnded={animateHeight}
        isInitialAnimation={isInitialAnimation}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
