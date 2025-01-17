import { type DrawerScreenProps } from '@react-navigation/drawer';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import Logo from '@/components/Logo/Logo';
import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';

export type HomeScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.Home
>;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { t } = useTranslation();
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      title: {
        color: colors.onPrimary,
        fontFamily: fonts.titleLarge.fontFamily,
        fontSize: fonts.titleLarge.fontSize,
      },
      description: {
        color: colors.onPrimary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
    }),
    [fonts, colors],
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Logo style={styles.logo} containerStyle={styles.logoContainer} />
      <View style={styles.textContainer}>
        <Text style={[styles.title, dynamicStyles.title]}>
          {t('home.title')}
        </Text>
        <Text style={[styles.description, dynamicStyles.description]}>
          {t('home.description')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logo: {
    position: 'static',
  },
  textContainer: {
    flex: 2,
  },
});

export default HomeScreen;
