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

import { colors } from '@/styles/common';

interface CTAProps {
  onPress?: () => void;
  source?: { uri: string };
  SvgComponent?: React.FC;
  text: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CTA: React.FC<CTAProps> = ({
  onPress,
  source,
  SvgComponent,
  text,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity style={[styles.ctaButton, style]} onPress={onPress}>
      <View style={styles.iconTextContainer}>
        {source && <Image source={source} style={styles.icon} />}
        {SvgComponent && <SvgComponent />}
        <Text style={[styles.iconText, textStyle]}>{text}</Text>
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
    alignItems: 'center',
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
  iconTextContainer: {
    display: 'flex',
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
