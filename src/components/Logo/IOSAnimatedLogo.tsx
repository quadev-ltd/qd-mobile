import { type FC, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

export const IOSAnimatedLogo: FC = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    // Bounce settles in under 2 s: the duration is perceptual (Reanimated 4 runs it 1.5x
    // longer, so about 1.8 s).
    scale.value = withSpring(0.75, {
      duration: 1200,
      dampingRatio: 0.35,
    });
  }, [scale]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  }, [scale]);

  return (
    <View style={styles.logoContainer}>
      <Animated.Image
        style={[styles.logo, animatedStyles]}
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

export default IOSAnimatedLogo;
