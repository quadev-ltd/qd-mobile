import { StyleSheet, Text } from 'react-native';

import { useDynamicStyles } from '@/styles/useDynamicStyles';

interface BrandedSubtitleProps {
  text: string;
  accessibilityLabel: string;
}
const BrandedSubtitle: React.FC<BrandedSubtitleProps> = ({
  accessibilityLabel,
  text,
}) => {
  const dynamicStyles = useDynamicStyles();
  return (
    <Text
      accessibilityLabel={accessibilityLabel}
      style={[styles.subtitle, dynamicStyles.brandedSubtitle]}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    paddingHorizontal: 0,
    paddingBottom: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default BrandedSubtitle;
