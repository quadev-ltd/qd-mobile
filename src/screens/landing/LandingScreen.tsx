import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import { Screen, type StackParamList } from '../routing/types';

import { CTA } from '@/components/CTA';
import { FooterPrompt } from '@/components/sign-in/FooterPrompt';
import { ScreenType } from '@/components/sign-in/types';
import { ApplicationEnvironentEnum } from '@/core/env';
import { colors } from '@/styles/common';

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
    <View style={styles.container}>
      <CTA text={t('landing.signUpButton')} onPress={goToSignUp} />
      <FooterPrompt changePath={goToSignIn} screen={ScreenType.Landing} />
      {route.params.environment !== ApplicationEnvironentEnum.Enum.prod && (
        <View style={styles.environmentPrompt}>
          <Text style={styles.environmentPromptText}>
            {route.params.environment}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 70,
    paddingHorizontal: 40,
    backgroundColor: colors.purpleBlue,
  },
  environmentPrompt: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  environmentPromptText: {
    color: colors.white,
    fontSize: 16,
  },
});
