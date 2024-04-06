import { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/styles/common';

interface AnimatedCTAProps {
  onPress?: () => void;
  testID?: string;
  source?: { uri: string };
  SvgComponent?: React.FC;
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
  source,
  SvgComponent,
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
        <View style={styles.iconTextContainer}>
          {source && <Image source={source} style={styles.icon} />}
          {SvgComponent && <SvgComponent />}
          <Text style={[styles.iconText, textStyle]}>{text}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ctaButton: {
    alignSelf: 'stretch',
    borderRadius: 50,
    backgroundColor: colors.black,
    paddingVertical: 14,
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  iconTextContainer: {
    display: 'flex',
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
