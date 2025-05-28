import { StyleSheet, Text } from 'react-native';

import { useDynamicStyles } from '@/styles/useDynamicStyles';

interface BrandedTitleProps {
  text: string;
  accessibilityLabel?: string;
}
const BrandedTitle: React.FC<BrandedTitleProps> = ({
  text,
  accessibilityLabel = text,
}) => {
  const dynamicStyles = useDynamicStyles();
  return (
    <Text
      style={[styles.title, dynamicStyles.brandedTitle]}
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

export default BrandedTitle;
