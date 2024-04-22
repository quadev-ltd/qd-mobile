import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { CTA } from '@/components/CTA';
import {
  FooterPromptHeight,
  FooterPromptTopMargin,
} from '@/components/SignIn/constants';
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
          <Image style={styles.logo} source={require('../../assets/png/logo.png')}/>
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
    width: 120,
    height: 150,
    position: 'absolute',
    top: 120,
  },
  signUpButton: {
    marginBottom: FooterPromptHeight + FooterPromptTopMargin,
  },
});

export default LandingScreen;
