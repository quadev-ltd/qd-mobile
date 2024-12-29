import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Platform } from 'react-native';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import AndroidLogo from '@/components/AndroidAnimatedLogo';
import CTA from '@/components/CTA';
import IOSLogo from '@/components/IOSAnimatedLogo';
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

  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);
  const goToSignIn = () => navigation.navigate(PublicScreen.SignIn, {});

  return (
    <Layout
      environment={
        route.params.environment !== ApplicationEnvironentEnum.Enum.prod
          ? route.params.environment
          : ''
      }>
      {Platform.OS === 'ios' ? <IOSLogo /> : <AndroidLogo />}
      <View style={styles.container}>
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
  signUpButton: {
    marginBottom: 12,
  },
});

export default LandingScreen;
