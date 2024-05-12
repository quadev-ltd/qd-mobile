import { StyleSheet, Text } from 'react-native';

import { colors } from '@/styles/colors';

interface ErrorMessageProps {
  text: string;
  accessibilityLabel: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  text,
  accessibilityLabel,
}) => {
  return (
    <Text style={styles.error} accessibilityLabel={accessibilityLabel}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    fontSize: 16,
    color: colors.red,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
});

export default ErrorMessage;
