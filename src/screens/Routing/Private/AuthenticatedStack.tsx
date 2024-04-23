import { createDrawerNavigator } from '@react-navigation/drawer';
import { useEffect } from 'react';

import { type DrawerParamList, PrivateScreen } from './types';

import CustomDrawerContent from '@/components/DrawerContent/DrawerContent';
import HomeScreen from '@/screens/Home/HomeScreen';
import HomeTwoScreen from '@/screens/HomeTwo/HomeTwoScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

type AuthenticatedStackProps = {
  hideSplashScreen: () => void;
};

const AuthenticatedStack: React.FC<AuthenticatedStackProps> = ({
  hideSplashScreen,
}) => {
  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName={PrivateScreen.Home}>
      <Drawer.Screen name={PrivateScreen.Home} component={HomeScreen} />
      <Drawer.Screen name={PrivateScreen.HomeTwo} component={HomeTwoScreen} />
    </Drawer.Navigator>
  );
};

export default AuthenticatedStack;
