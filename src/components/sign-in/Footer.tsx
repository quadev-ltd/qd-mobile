import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { FooterPrompt } from './FooterPrompt';
import { type ScreenType } from './types';

import { CTA } from '@/components/CTA';

interface FooterProps {
  submit: () => void;
  changePath: () => void;
  screen?: ScreenType;
}

export const Footer: React.FC<FooterProps> = ({
  submit,
  changePath,
  screen,
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <CTA text={t(`${screen}.submitButton`)} onPress={submit} />
      <FooterPrompt changePath={changePath} screen={screen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
});
