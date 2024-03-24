import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';

import { CTA } from '../CTA';

import { Divider } from './Divider';
import { type ScreenType } from './types';

import { SvgFacebook } from '@/assets/svg/Facebook';
import { colors } from '@/styles/common';

type HeaderProps = {
  screen: ScreenType;
  handleFacebookLogin: () => void;
  handleGoogleLogin: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  screen,
  handleFacebookLogin,
  handleGoogleLogin,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.header}>
        <CTA
          SvgComponent={SvgFacebook}
          text={t(`${screen}.withGoogle`)}
          style={styles.facebookButton}
          onPress={handleFacebookLogin}
        />
        <CTA
          source={require('../../assets/png/google.png')}
          text={t(`${screen}.withGoogle`)}
          style={styles.googleButton}
          textStyle={{ color: colors.grey }}
          onPress={handleGoogleLogin}
        />
      </View>
      <Divider label={t(`${screen}.withEmail`)} />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
  },
  facebookButton: {
    backgroundColor: colors.facebookBlue,
    marginBottom: 20,
  },
  googleButton: { backgroundColor: colors.white },
});
