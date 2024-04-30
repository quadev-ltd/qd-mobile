import { StyleSheet, Text } from 'react-native';

import { colors } from '@/styles';

interface TitleProps {
  text: string;
  accessibilityLabel?: string;
}
const Title: React.FC<TitleProps> = ({ text, accessibilityLabel = text }) => {
  return (
    <Text style={styles.title} accessibilityLabel={accessibilityLabel}>
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
    color: colors.white,
    marginBottom: 32,
  },
});

export default Title;
