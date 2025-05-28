import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
} from 'react-native';

import { useDynamicStyles } from '@/styles/useDynamicStyles';

interface FlatTextCTAProps {
  onPress: () => void;
  text: string;
  accessibilityLabel: string;
  style?: TextStyle;
  Icon?: ReactNode;
  disabled?: boolean;
}

export const FlatTextCTA: React.FC<FlatTextCTAProps> = ({
  onPress,
  text,
  accessibilityLabel,
  style,
  Icon,
  disabled,
}) => {
  const dynamicStyles = useDynamicStyles();
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          dynamicStyles.textCTAText,
          style,
          disabled && dynamicStyles.disabled,
        ]}>
        {text}
      </Text>
      {Icon && Icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 0,
    marginTop: -12,
  },
  text: {
    fontWeight: '700',
    alignSelf: 'center',
    paddingHorizontal: 8,
  },
});

export default FlatTextCTA;
