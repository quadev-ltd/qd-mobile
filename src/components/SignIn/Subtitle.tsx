import { StyleSheet, Text } from 'react-native';

import { colors } from '@/styles';

interface SubtitleProps {
  text: string;
  accessibilityLabel: string;
}
const Subtitle: React.FC<SubtitleProps> = ({ accessibilityLabel, text }) => (
  <Text accessibilityLabel={accessibilityLabel} style={styles.subtitle}>
    {text}
  </Text>
);

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    paddingHorizontal: 0,
    paddingBottom: 32,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.white,
    lineHeight: 24,
  },
});

export default Subtitle;
