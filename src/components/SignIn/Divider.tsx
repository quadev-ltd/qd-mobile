import { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  type SharedValue,
} from 'react-native-reanimated';

import { MaterialIcon } from '../MaterialIcon';

import { useDividerDynamicStyles } from '@/styles/useDividerDynamicStyles';

type DividerProps = {
  label: string;
  onPress?: () => void;
  hide?: boolean;
  onAnimationEnded?: () => void;
};

export const DIVIDER_ANIMATION_DURATION = 200;

const animateButton = (
  scaleX: SharedValue<number>,
  scaleY: SharedValue<number>,
  hide?: boolean,
  onAnimationEnded?: () => void,
) => {
  const animationSequence = withSequence(
    withTiming(hide ? 0 : 1, { duration: DIVIDER_ANIMATION_DURATION }),
    withTiming(hide ? 0 : 1, { duration: DIVIDER_ANIMATION_DURATION }),
  );

  scaleX.value = animationSequence;
  scaleY.value = animationSequence;

  if (onAnimationEnded) {
    setTimeout(onAnimationEnded, DIVIDER_ANIMATION_DURATION);
  }
};

export const Divider: React.FC<DividerProps> = ({
  label,
  onPress,
  hide,
  onAnimationEnded,
}) => {
  const theme = useTheme();
  const dynamicStyles = useDividerDynamicStyles();

  const scaleX = useSharedValue(0);
  const scaleY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scaleX: scaleX.value }, { scaleY: scaleY.value }],
      opacity: scaleY.value,
    }),
    [scaleX, scaleY],
  );

  useEffect(() => {
    animateButton(scaleX, scaleY, hide, onAnimationEnded);
  }, [hide, scaleX, scaleY, onAnimationEnded]);

  return (
    <Animated.View
      testID="divider"
      style={[styles.dividerContainer, animatedStyle]}>
      <View style={[styles.divider, dynamicStyles.divider]} />
      <GestureHandlerRootView>
        <Swipeable onSwipeableOpenStartDrag={onPress}>
          <TouchableOpacity
            testID="divider-cta"
            style={styles.buttonContainer}
            onPress={onPress}>
            <View style={styles.dividerContentContainer}>
              <MaterialIcon
                style={styles.googleSSO}
                name="google"
                size={26}
                color={theme.colors.secondary}
              />
              {Platform.OS === 'ios' && (
                <>
                  <Text style={[styles.dividerText, dynamicStyles.dividerText]}>
                    {label}
                  </Text>
                  <MaterialIcon
                    name="apple"
                    size={32}
                    color={theme.colors.secondary}
                  />
                </>
              )}
            </View>
            <MaterialIcon
              name="chevron-down"
              size={32}
              color={theme.colors.secondary}
            />
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
      <View style={[styles.divider, dynamicStyles.divider]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    marginTop: -32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  divider: {
    borderWidth: 0.5,
    flexGrow: 1,
    height: 1,
    margin: 0,
    marginTop: 32,
  },
  dividerContentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 80,
    marginTop: 24,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 12,
  },
  dividerText: {
    fontWeight: '700',
    marginTop: 8,
    marginHorizontal: 8,
  },
  googleSSO: {
    marginTop: 4,
  },
});
