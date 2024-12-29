import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';

export const AnimatedLogo: React.FC = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(0.75, {
      damping: 2,
      stiffness: 100,
      mass: 1,
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
        source={require('../assets/png/logo.png')}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    flexDirection: 'column',
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
