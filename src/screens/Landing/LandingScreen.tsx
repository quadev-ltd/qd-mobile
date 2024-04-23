import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { CTA } from '@/components/CTA';
import { FooterPrompt } from '@/components/SignIn/FooterPrompt';
import { Layout } from '@/components/SignIn/Layout';
import { ScreenType } from '@/components/SignIn/types';
import { ApplicationEnvironentEnum } from '@/core/env';

export type LandingScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.Landing
>;

export const LandingScreen: React.FC<LandingScreenProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
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
  });

  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);
  const goToSignIn = () => navigation.navigate(PublicScreen.SignIn);
  return (
    <Layout
      environment={
        route.params.environment !== ApplicationEnvironentEnum.Enum.prod
          ? route.params.environment
          : ''
      }>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Animated.Image
            style={[styles.logo, animatedStyles]}
            source={require('../../assets/png/logo.png')}
            resizeMode="cover"
          />
        </View>
        <CTA
          style={styles.signUpButton}
          text={t('landing.signUpButton')}
          accessibilityLabel={t('landing.signUpButtonAccessibilityLabel')}
          onPress={goToSignUp}
        />
      </View>
      <FooterPrompt changePath={goToSignIn} screen={ScreenType.Landing} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
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
  signUpButton: {
    marginBottom: 12,
  },
});

export default LandingScreen;
