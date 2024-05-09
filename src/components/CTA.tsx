import { type ReactNode, useEffect, useState } from 'react';
import {
  Animated,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/styles';

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
  scale: Animated.Value,
  hide?: boolean,
  onAnimationEnded?: () => void,
) => {
  Animated.timing(scale, {
    toValue: hide ? 0 : 1,
    duration: BUTTON_ANIMATION_DURATION,
    useNativeDriver: true,
  }).start(onAnimationEnded);
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
  const [scale] = useState(new Animated.Value(disableAnimation ? 1 : 0));
  useEffect(() => {
    isAnimated && animateButton(scale, hide, onAnimationEnded);
  }, [hide, scale, onAnimationEnded, isAnimated]);

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
          style,
          disabled && styles.disabled,
          isAnimated && {
            transform: [{ scale }],
            opacity: scale,
          },
        ]}>
        {Icon && Icon}
        <View style={styles.textContainer}>
          <Text
            style={[styles.text, textStyle, disabled && styles.textDisabled]}>
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
    backgroundColor: colors.black,
    alignItems: 'center',
    paddingHorizontal: 24,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    backgroundColor: colors.disabledGrey,
    opacity: 0.3,
  },
  textDisabled: {
    color: colors.grey,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

export default CTA;
