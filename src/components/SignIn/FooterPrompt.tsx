import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, Platform } from 'react-native';

import FlatTextCTA from '../FlatTextCTA';

import { type ScreenType } from './types';

import { colors } from '@/styles';

interface FooterPromptProps {
  changePath: () => void;
  screen?: ScreenType;
}

export const FooterPrompt: React.FC<FooterPromptProps> = ({
  changePath,
  screen,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{t(`${screen}.changePathDescription`)}</Text>
      <FlatTextCTA
        text={t(`${screen}.changePathButton`)}
        accessibilityLabel={t(`${screen}.changePathButton`)}
        onPress={changePath}
      />
    </View>
  );
};

export const FooterPromptHeight = Platform.OS === 'ios' ? 48 : 64;

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    height: FooterPromptHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  prompt: {
    color: colors.white,
    fontWeight: '700',
    // alignSelf: 'center',
  },
});
