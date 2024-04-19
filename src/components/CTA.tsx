import {
  Image,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import { colors } from '@/styles';

interface CTAProps {
  onPress?: () => void;
  source?: { uri: string };
  SvgComponent?: React.FC;
  text: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const CTA: React.FC<CTAProps> = ({
  onPress,
  source,
  SvgComponent,
  text,
  accessibilityLabel,
  style,
  textStyle,
  disabled,
}) => {
  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}>
      <View style={[styles.ctaButton, disabled && styles.disabled, style]}>
        <View style={styles.iconTextContainer}>
          {source && <Image source={source} style={styles.icon} />}
          {SvgComponent && <SvgComponent />}
          <Text
            style={[
              styles.iconText,
              disabled && styles.iconTextDisabled,
              textStyle,
            ]}>
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ctaButton: {
    alignSelf: 'stretch',
    borderRadius: 50,
    height: 50,
    backgroundColor: colors.black,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  disabled: {
    backgroundColor: colors.disabledGrey,
    opacity: 0.3,
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  iconTextDisabled: {
    color: colors.grey,
  },
  iconTextContainer: {
    display: 'flex',
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
