import {
  createDrawerNavigator,
  type DrawerNavigationProp,
} from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { type DrawerParamList, PrivateScreen } from './types';

import CustomDrawerContent from '@/components/DrawerContent/DrawerContent';
import { MaterialIcon } from '@/components/MaterialIcon';
import { useFlag } from '@/core/flags/FlagsProvider';
import DeleteAccountScreen from '@/screens/DeleteAccount/DeleteAccountScreen';
import DetectAnomaliesScreen from '@/screens/DetectAnomalies/DetectAnomaliesScreen';
import HomeScreen from '@/screens/Home/HomeScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

const AuthenticatedStack: React.FC = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  // Smart inspection is still a mock: hidden (no route, no drawer item) unless the flag is on.
  const smartInspection = useFlag('smartInspection');

  const renderHeaderLeft = (
    navigation: DrawerNavigationProp<DrawerParamList>,
    route: { name: string },
  ) => (
    <TouchableOpacity
      testID="drawer-menu-button"
      accessibilityLabel={t('drawerMenu.openMenu')}
      style={styles.burgerButton}
      onPress={() => navigation.toggleDrawer()}>
      <MaterialIcon
        name="menu"
        size={24}
        color={
          route.name === PrivateScreen.Home
            ? colors.onPrimary
            : colors.onBackground
        }
      />
    </TouchableOpacity>
  );

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName={PrivateScreen.Home}
      screenOptions={({ navigation, route }) => ({
        headerLeft: () => renderHeaderLeft(navigation, route),
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
        headerTitle: '',
        // React Navigation 7 changed the default to 'slide' on iOS; keep v6 behaviour.
        drawerType: 'front',
      })}>
      <Drawer.Screen name={PrivateScreen.Home} component={HomeScreen} />
      {smartInspection && (
        <Drawer.Screen
          name={PrivateScreen.DetectObject}
          component={DetectAnomaliesScreen}
        />
      )}
      <Drawer.Screen
        name={PrivateScreen.DeleteAccount}
        component={DeleteAccountScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  burgerButton: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 4,
  },
});

export default AuthenticatedStack;
