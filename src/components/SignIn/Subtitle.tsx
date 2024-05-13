import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SubtitleProps {
  text: string;
  accessibilityLabel: string;
}
const Subtitle: React.FC<SubtitleProps> = ({ accessibilityLabel, text }) => {
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      subtitle: {
        color: colors.onPrimary,
        fontFamily: fonts.titleMedium.fontFamily,
        fontSize: fonts.titleMedium.fontSize,
      },
    }),
    [fonts, colors],
  );
  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      style={[styles.subtitle, dynamicStyles.subtitle]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    paddingHorizontal: 0,
    paddingBottom: 32,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Subtitle;
