import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { type DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

import { MaterialIcon } from '../MaterialIcon';

import DrawerCTA from './DrawerCTA';

import { NO_SURNAME_PROVIDED } from '@/core/sso/constants';
import { useAppDispatch, useAppSelector } from '@/core/state/hooks';
import { getUserDetailsSelector } from '@/core/state/selectors/user';
import { logout } from '@/core/state/slices/authSlice';
import { PrivateScreen } from '@/screens/Routing/Private/types';
import { colors } from '@/styles/colors';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUserDetailsSelector);
  const handleLogout = () => dispatch(logout());
  const handleDeleteAccount = () => {
    props.navigation.navigate(PrivateScreen.DeleteAccount);
  };
  const lastName = user?.lastName === NO_SURNAME_PROVIDED ? '' : user?.lastName;
  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.container}
      {...props}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatarContainer}>
          <MaterialIcon style={styles.avatar} name="account" size={40} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.drawerHeaderTitle}>
            {user?.firstName} {lastName}
          </Text>
          <Text style={styles.drawerHeaderSubtitle}>{user?.email}</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.drawerFooter}>
        <DrawerCTA
          accessibilityLabel={t('drawerMenu.deleteAccount')}
          text={t('drawerMenu.deleteAccount')}
          onPress={handleDeleteAccount}
        />
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
    alignItems: 'stretch',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 12,
    height: 45,
    width: 45,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: colors.black,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: 40,
    width: 40,
  },
  textContainer: {
    flex: 1,
  },
  drawerHeaderTitle: {
    fontSize: 18,
    paddingBottom: 4,
    flexWrap: 'wrap',
  },
  drawerHeaderSubtitle: {
    flexWrap: 'wrap',
    fontSize: 14,
  },
  drawerFooter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: 16,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
});

export default CustomDrawerContent;
