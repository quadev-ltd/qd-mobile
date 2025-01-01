import { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';

const IMAGE_HEIGHT = 185;
const IMAGE_WIDTH = 150;

export const AndroidAnimatedLogo: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const scale = useSharedValue(1);
  const top = useSharedValue(height / 2 - IMAGE_HEIGHT / 2);
  const left = (width - IMAGE_WIDTH) / 2;

  useEffect(() => {
    scale.value = withSpring(
      0.75,
      {
        damping: 2,
        stiffness: 50,
        mass: 3,
      },
      () => {
        top.value = withTiming(96, {
          duration: 500,
        });
      },
    );
  }, [scale, top]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      top: top.value,
      left,
    };
  });

  return (
    <Animated.Image
      style={[styles.logo, animatedStyles]}
      source={require('../../assets/png/logo.png')}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    position: 'absolute',
    zIndex: 1000,
  },
});

export default AndroidAnimatedLogo;
