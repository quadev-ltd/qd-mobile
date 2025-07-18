import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { colors } from '@/styles/colors';

interface SpinnerProps {
  style?: ViewStyle;
  color?: string;
  size?: number | 'small' | 'large' | undefined;
}

const Spinner: React.FC<SpinnerProps> = ({ style, color, size }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size || 'large'}
        animating={true}
        color={color || colors.blackSpinner}
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
