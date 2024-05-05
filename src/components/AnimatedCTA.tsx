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

interface AnimatedCTAProps {
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

export const AnimatedCTA: React.FC<AnimatedCTAProps> = ({
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
}) => {
  const [scale] = useState(new Animated.Value(disableAnimation ? 1 : 0));
  useEffect(() => {
    animateButton(scale, hide, onAnimationEnded);
  }, [hide, scale, onAnimationEnded]);

  return (
    <TouchableOpacity accessibilityLabel={accessibilityLabel} onPress={onPress}>
      <Animated.View
        testID={testID}
        style={[
          styles.ctaButton,
          style,
          {
            transform: [{ scale }],
            opacity: scale,
          },
        ]}>
        {Icon && Icon}
        <View style={styles.iconTextContainer}>
          <Text style={[styles.iconText, textStyle]}>{text}</Text>
        </View>
      </Animated.View>
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
  iconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  iconTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
