import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';

import { SvgCarretUp } from '@/assets/svg/CarretUp';
import { SvgFacebook } from '@/assets/svg/Facebook';
import { SvgGoogle } from '@/assets/svg/Google';
import { colors } from '@/styles/common';

type DividerProps = {
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

export const Divider: React.FC<DividerProps> = ({
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
      testID="divider"
      style={[
        styles.dividerContainer,
        {
          transform: [{ scaleX }, { scaleY }],
          opacity: scaleY,
        },
      ]}>
      <View style={styles.divider} />
      <GestureHandlerRootView>
        <Swipeable onSwipeableOpenStartDrag={onPress}>
          <TouchableOpacity
            testID="divider-cta"
            style={styles.buttonContainer}
            onPress={onPress}>
            <SvgCarretUp />
            <View style={styles.dividerContentContainer}>
              <SvgGoogle color={colors.black} />
              <Text style={styles.dividerText}>{label}</Text>
              <SvgFacebook color={colors.black} />
            </View>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
      <View style={styles.divider} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    marginTop: -24,
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
    marginTop: 32,
  },
  dividerContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
    marginTop: -8,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerText: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: -8,
  },
});
