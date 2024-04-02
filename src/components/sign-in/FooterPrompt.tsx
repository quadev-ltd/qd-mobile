import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import {
  FooterPromptHeight,
  FooterPromptTopMargin,
  LayoutPaddingVertical,
} from './constants';
import { type ScreenType } from './types';

import { colors } from '@/styles/common';

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
      <TouchableOpacity onPress={changePath}>
        <Text style={styles.footerAction}>
          {t(`${screen}.changePathButton`)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: LayoutPaddingVertical,
    height: FooterPromptHeight,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: FooterPromptTopMargin,
  },
  prompt: {
    color: colors.white,
    fontWeight: '700',
    alignSelf: 'center',
  },
  footerAction: {
    fontWeight: '700',
    alignSelf: 'center',
    paddingLeft: 8,
  },
});
