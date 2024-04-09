import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" animating={true} color={MD2Colors.black} />
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