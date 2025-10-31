import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

interface TitleProps {
  text: string;
  accessibilityLabel?: string;
}
const Title: React.FC<TitleProps> = ({ text, accessibilityLabel = text }) => {
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      title: {
        color: colors.onPrimary,
        fontFamily: fonts.headlineMedium.fontFamily,
        fontSize: fonts.headlineMedium.fontSize,
      },
    }),
    [fonts, colors],
  );
  return (
    <Text
      style={[styles.title, dynamicStyles.title]}
      accessibilityLabel={accessibilityLabel}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
});

export default Title;
