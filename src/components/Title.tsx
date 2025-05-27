import { StyleSheet, Text } from 'react-native';

import { useDynamicStyles } from '@/styles/useDynamicStyles';

interface TitleProps {
  text: string;
  accessibilityLabel?: string;
}
const Title: React.FC<TitleProps> = ({ text, accessibilityLabel = text }) => {
  const dynamicStyles = useDynamicStyles();
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
