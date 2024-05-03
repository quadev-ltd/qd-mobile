import { View, StyleSheet, type ImageStyle, Image } from 'react-native';

interface LogoProps {
  style?: ImageStyle;
}

export const Logo: React.FC<LogoProps> = ({ style }) => {
  return (
    <View style={styles.logoContainer}>
      <Image
        style={[styles.logo, style]}
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

export default Logo;
