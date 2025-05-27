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
import DetectAnomaliesScreen from '@/screens/DetectAnomalies/DetectAnomaliesScreen';
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
    route: { name: string },
  ) => (
    <TouchableOpacity
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
      })}>
      <Drawer.Screen name={PrivateScreen.Home} component={HomeScreen} />
      <Drawer.Screen
        name={PrivateScreen.DetectObject}
        component={DetectAnomaliesScreen}
      />
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
