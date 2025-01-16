import {
  createDrawerNavigator,
  type DrawerNavigationProp,
} from '@react-navigation/drawer';
import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { type DrawerParamList, PrivateScreen } from './types';

import CustomDrawerContent from '@/components/DrawerContent/DrawerContent';
import { MaterialIcon } from '@/components/MaterialIcon';
import DeleteAccountScreen from '@/screens/DeleteAccount/DeleteAccountScreen';
import HomeScreen from '@/screens/Home/HomeScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

type AuthenticatedStackProps = {
  hideSplashScreen: () => void;
};

const AuthenticatedStack: React.FC<AuthenticatedStackProps> = ({
  hideSplashScreen,
}) => {
  const { colors } = useTheme();
  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  const renderHeaderLeft = (
    navigation: DrawerNavigationProp<DrawerParamList>,
  ) => (
    <TouchableOpacity
      style={styles.burgerButton}
      onPress={() => navigation.toggleDrawer()}>
      <MaterialIcon name="menu" size={24} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName={PrivateScreen.Home}
      screenOptions={({ navigation }) => ({
        headerLeft: () => renderHeaderLeft(navigation),
      })}>
      <Drawer.Screen name={PrivateScreen.Home} component={HomeScreen} />
      <Drawer.Screen
        name={PrivateScreen.DeleteAccount}
        component={DeleteAccountScreen}
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
