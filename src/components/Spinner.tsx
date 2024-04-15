import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { colors } from '@/styles';

const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" animating={true} color={colors.black} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Spinner;
