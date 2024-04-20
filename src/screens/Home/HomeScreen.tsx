import { type DrawerScreenProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';

export type HomeScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.Home
>;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  return (
    <View>
      <Text style={styles.homeText} />
    </View>
  );
};

const styles = StyleSheet.create({
  homeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default HomeScreen;
