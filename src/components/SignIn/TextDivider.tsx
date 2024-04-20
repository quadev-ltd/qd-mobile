import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';

import { colors } from '@/styles';

type TextDividerProps = {
  label: string;
  onPress?: () => void;
  hide?: boolean;
  onAnimationEnded?: () => void;
};
export const DIVIDER_ANIMATION_DURATION = 200;

const animateButton = (
  scaleX: Animated.Value,
  scaleY: Animated.Value,
  hide?: boolean,
  onAnimationEnded?: () => void,
) => {
  const animationSequence = [
    Animated.timing(scaleX, {
      toValue: hide ? 0 : 1,
      duration: DIVIDER_ANIMATION_DURATION,
      useNativeDriver: true,
    }),
    Animated.timing(scaleY, {
      toValue: hide ? 0 : 1,
      duration: DIVIDER_ANIMATION_DURATION,
      useNativeDriver: true,
    }),
  ];
  Animated.sequence(
    hide ? animationSequence : animationSequence.reverse(),
  ).start(onAnimationEnded);
};

export const TextDivider: React.FC<TextDividerProps> = ({
  label,
  onPress,
  hide,
  onAnimationEnded,
}) => {
  const [scaleX] = useState(new Animated.Value(0));
  const [scaleY] = useState(new Animated.Value(0));

  useEffect(() => {
    animateButton(scaleX, scaleY, hide, onAnimationEnded);
  }, [hide, scaleX, scaleY, onAnimationEnded]);
  return (
    <Animated.View
      style={[
        styles.dividerContainer,
        {
          transform: [{ scaleX }, { scaleY }],
          opacity: scaleY,
        },
      ]}>
      <View style={styles.divider} />
      <Text style={styles.dividerText} onPress={onPress}>
        {label}
      </Text>
      <View style={styles.divider} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    marginTop: 0,
    marginHorizontal: -20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  divider: {
    borderColor: colors.black,
    borderWidth: 0.5,
    flexGrow: 1,
    height: 1,
    margin: 0,
  },
  dividerText: {
    fontWeight: '700',
  },
});
