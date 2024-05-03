import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
} from 'react-native';

import { colors } from '@/styles';

interface DrawerCTAProps {
  onPress: () => void;
  text: string;
  accessibilityLabel: string;
  style?: TextStyle;
  Icon?: ReactNode;
  disabled?: boolean;
}

export const DrawerCTA: React.FC<DrawerCTAProps> = ({
  onPress,
  text,
  accessibilityLabel,
  style,
  disabled,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}>
      <Text style={[styles.text, style, disabled && styles.disabled]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  text: {
    fontWeight: '700',
    alignSelf: 'center',
    paddingHorizontal: 16,
    marginLeft: 16,
    color: colors.black,
  },
  disabled: {
    color: colors.disabledGrey,
    opacity: 0.5,
  },
});

export default DrawerCTA;
