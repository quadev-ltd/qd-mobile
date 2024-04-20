import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { type DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import DrawerCTA from './DrawerCTA';

import { useAppDispatch } from '@/core/state/hooks';
import { logout } from '@/core/state/slices/authSlice';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const handleLogout = () => dispatch(logout());
  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.container}
      {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>{t('drawerMenu.signOut')}</Text>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.drawerContent}>
        <DrawerCTA
          accessibilityLabel={t('drawerMenu.signOut')}
          text={t('drawerMenu.signOut')}
          onPress={handleLogout}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
  },
  drawerHeaderText: {
    fontSize: 18,
  },
  drawerContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginBottom: 48,
  },
});

export default CustomDrawerContent;
