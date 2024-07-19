import { type ReactNode, useEffect, useMemo } from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  type SharedValue,
} from 'react-native-reanimated';

interface CTAProps {
  onPress?: () => void;
  testID?: string;
  Icon?: ReactNode;
  text: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  hide?: boolean;
  onAnimationEnded?: () => void;
  disableAnimation?: boolean;
  isAnimated?: boolean;
  disabled?: boolean;
}

export const BUTTON_ANIMATION_DURATION = 300;

const animateButton = (
  scale: SharedValue<number>,
  hide?: boolean,
  onAnimationEnded?: () => void,
) => {
  scale.value = withTiming(
    hide ? 0 : 1,
    { duration: BUTTON_ANIMATION_DURATION },
    isFinished => {
      if (isFinished && onAnimationEnded) {
        runOnJS(onAnimationEnded)();
      }
    },
  );
};

export const CTA: React.FC<CTAProps> = ({
  onPress,
  testID,
  Icon,
  text,
  accessibilityLabel,
  style,
  textStyle,
  hide,
  onAnimationEnded,
  disableAnimation,
  isAnimated,
  disabled,
}) => {
  const { fonts, colors } = useTheme();
  const scale = useSharedValue(disableAnimation ? 1 : 0);

  useEffect(() => {
    if (isAnimated) {
      animateButton(scale, hide, onAnimationEnded);
    }
  }, [hide, scale, onAnimationEnded, isAnimated]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }),
    [scale],
  );

  const dynamicStyles = useMemo(
    () => ({
      ctaButton: {
        backgroundColor: colors.secondary,
      },
      text: {
        color: colors.onSecondary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      disabled: {
        backgroundColor: colors.surfaceDisabled,
        opacity: 0.3,
      },
    }),
    [fonts, colors],
  );

  const AnimatedView = isAnimated
    ? Animated.createAnimatedComponent(View)
    : View;

  return (
    <TouchableOpacity
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}>
      <AnimatedView
        testID={testID}
        style={[
          styles.ctaButton,
          dynamicStyles.ctaButton,
          style,
          disabled && dynamicStyles.disabled,
          isAnimated && animatedStyle,
        ]}>
        {Icon && (
          <View style={styles.icon} >
            {Icon}
          </View>
          )}
        <View style={styles.textContainer}>
          <Text style={[styles.text, dynamicStyles.text, textStyle]}>
            {text}
          </Text>
        </View>
      </AnimatedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ctaButton: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    paddingHorizontal: 24,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    position: 'absolute',
    left: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default CTA;
