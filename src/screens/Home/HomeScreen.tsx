import { type DrawerScreenProps } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import Logo from '@/components/Logo/Logo';
import Header from '@/components/SignIn/BrandedHeader';
import { useLoadUserProfile } from '@/core/api/hooks/useLoadUserProfile';
import { useAppSelector } from '@/core/state/hooks';
import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';

export type HomeScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.Home
>;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const authToken = useAppSelector(state => state.auth.authToken);
  useLoadUserProfile(authToken);
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Logo style={styles.logo} containerStyle={styles.logoContainer} />
      <View style={styles.textContainer}>
        <Header
          title={t('home.title')}
          titleAccessibilityLabel={t('home.title')}
          subtitle={t('home.description')}
          subtitleAccessibilityLabel={t('home.description')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
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
