import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { colors } from '@/styles';

interface SpinnerProps {
  style?: ViewStyle;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ style, color }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size="large"
        animating={true}
        color={color || colors.black}
      />
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
