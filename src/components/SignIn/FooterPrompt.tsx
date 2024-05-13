import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';

import FlatTextCTA from '../FlatTextCTA';

import { type ScreenType } from './types';

interface FooterPromptProps {
  changePath: () => void;
  screen?: ScreenType;
}

export const FooterPrompt: React.FC<FooterPromptProps> = ({
  changePath,
  screen,
}) => {
  const { t } = useTranslation();
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      prompt: {
        color: colors.onPrimary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
    }),
    [fonts, colors],
  );
  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, dynamicStyles.prompt]}>
        {t(`${screen}.changePathDescription`)}
      </Text>
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
    fontWeight: '700',
  },
});
