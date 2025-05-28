import { StyleSheet, Text } from 'react-native';

import { useDynamicStyles } from '@/styles/useDynamicStyles';

interface BrandedHeaderProps {
  title?: string;
  titleAccessibilityLabel?: string;
  subtitle?: string;
  subtitleAccessibilityLabel?: string;
}

const BrandedHeader: React.FC<BrandedHeaderProps> = ({
  title,
  titleAccessibilityLabel,
  subtitle,
  subtitleAccessibilityLabel,
}) => {
  const dynamicStyles = useDynamicStyles();
  return (
    <>
      {title && (
        <Text
          style={[styles.title, dynamicStyles.brandedTitle]}
          accessibilityLabel={titleAccessibilityLabel}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text
          accessibilityLabel={subtitleAccessibilityLabel}
          style={[styles.subtitle, dynamicStyles.brandedSubtitle]}>
          {subtitle}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BrandedHeader;
