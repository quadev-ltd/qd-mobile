import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { Screen, type StackParamList } from '../Routing/types';

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
  Screen.Landing
>;

export const LandingScreen: React.FC<LandingScreenProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const goToSignUp = () => navigation.navigate(Screen.SignUp);
  const goToSignIn = () => navigation.navigate(Screen.SignIn);
  return (
    <Layout
      environment={
        route.params.environment !== ApplicationEnvironentEnum.Enum.prod
          ? route.params.environment
          : ''
      }>
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
    marginBottom: FooterPromptHeight + FooterPromptTopMargin,
  },
});