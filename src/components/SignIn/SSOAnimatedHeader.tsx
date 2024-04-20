import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, View, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AnimatedCTA } from '../AnimatedCTA';

import {
  FooterPromptHeight as FOOTER_PROMPT_HEIGHT,
  FooterPromptTopMargin as FOOTER_PROMPT_TOP_MARGIN,
  LayoutPaddingVertical as LAYOUT_PADDING_VERTICAL,
} from './constants';
import { SSOSwitch } from './SSOSwitch';
import { type ScreenType } from './types';

import { colors } from '@/styles';

const { height: VIEWPORT_HEIGHT } = Dimensions.get('window');
const FacebookIcon = () => (
  <Icon name="facebook" size={36} color={colors.white} />
);

type SSOAnimatedHeaderProps = {
  screen: ScreenType;
  isSSOExpanded: boolean;
  switchSSO: () => void;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
  onAnimationEnded?: () => void;
  disableAnimation?: boolean;
};

const COLLAPSED_CONTAINER_HEIGHT = 50;
const LAYOUT_CONTAINER_HEIGHT = VIEWPORT_HEIGHT - 2 * LAYOUT_PADDING_VERTICAL;
const HEADER_CONTAINER_BOTTOM_PADDING =
  FOOTER_PROMPT_HEIGHT + FOOTER_PROMPT_TOP_MARGIN;
export const SSO_COLLAPSE_FIRST_STAGE_DURATION = 700;
export const SSOAnimatedHeader: React.FC<SSOAnimatedHeaderProps> = ({
  screen,
  isSSOExpanded,
  switchSSO,
  handleFacebookLogin,
  handleGoogleLogin,
  onAnimationEnded,
  disableAnimation,
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
  const animateHeight = useCallback(() => {
    !disableAnimation &&
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
  }, [
    isSSOExpanded,
    disableAnimation,
    onAnimationEnded,
    animatedHeight,
    animatedBottomMargin,
  ]);

  const ssoCollapseStarted = isExpandedSecondAnimation && !isSSOExpanded;
  const shoulHideSSOButtons = !isExpandedSecondAnimation || ssoCollapseStarted;
  return (
    <Animated.View
      style={{ height: animatedHeight, paddingBottom: animatedBottomMargin }}>
      <View style={styles.ssoButtonsContainer}>
        {isExpandedSecondAnimation && (
          <>
            <AnimatedCTA
              testID="facebook-cta"
              Icon={<FacebookIcon />}
              text={t(`${screen}.withFacebook`)}
              accessibilityLabel={t(`${screen}.withFacebookAccessibilityLabel`)}
              style={styles.facebookButton}
              onPress={handleFacebookLogin}
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
              onPress={handleGoogleLogin}
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
  ssoButtonsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  facebookButton: {
    alignItems: 'flex-start',
    backgroundColor: colors.facebookBlue,
    marginBottom: 20,
  },
  googleButton: {
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    marginBottom: 20,
  },
});
