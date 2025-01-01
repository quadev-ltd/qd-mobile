import { useEffect, type FC } from 'react';
import { View, StyleSheet, type ImageStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface IOSAnimatedLogoProps {
  style?: ImageStyle;
  isAnimated: boolean;
  show?: boolean;
  bounceAnimationEnabled?: boolean;
}

export const AnimatedLogo: FC<IOSAnimatedLogoProps> = ({
  style,
  show,
  isAnimated,
}) => {
  const scale = useSharedValue(show && isAnimated ? 0 : 1);

  useEffect(() => {
    if (isAnimated) {
      scale.value = withTiming(show ? 1 : 0, {
        duration: 400,
        easing: Easing.ease,
      });
    }
  }, [isAnimated, scale, show]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, [scale]);

  return (
    <View style={styles.logoContainer}>
      <Animated.Image
        style={[styles.logo, style, animatedStyles]}
        source={require('../../assets/png/logo.png')}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 64,
  },
  logo: {
    width: 150,
    height: 185,
    position: 'absolute',
    top: 96,
  },
});

export default AnimatedLogo;
