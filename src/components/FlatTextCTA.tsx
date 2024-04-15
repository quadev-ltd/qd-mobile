import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
} from 'react-native';

import { colors } from '@/styles';

interface FlatTextCTAProps {
  onPress: () => void;
  text: string;
  accessibilityLabel: string;
  style?: TextStyle;
  Icon?: ReactNode;
}

export const FlatTextCTA: React.FC<FlatTextCTAProps> = ({
  onPress,
  text,
  accessibilityLabel,
  style,
  Icon,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}>
      <Text style={[styles.text, style]}>{text}</Text>
      {Icon && Icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    alignSelf: 'center',
    paddingHorizontal: 8,
    color: colors.black,
  },
});

export default FlatTextCTA;
