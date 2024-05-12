import { useMemo, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'react-native-paper';

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
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      text: {
        color: colors.secondary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      disabled: {
        color: colors.surfaceDisabled,
        opacity: 0.3,
      },
    }),
    [fonts, colors],
  );
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.container}
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}>
      <Text
        style={[
          styles.text,
          dynamicStyles.text,
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
