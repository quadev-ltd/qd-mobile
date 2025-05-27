import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useDynamicStyles = () => {
  const { fonts, colors } = useTheme();
  return useMemo(
    () => ({
      ctaButton: {
        backgroundColor: colors.secondary,
      },
      ctaText: {
        color: colors.onPrimary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      textCTAText: {
        color: colors.secondary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      brandedTitle: {
        color: colors.onPrimary,
        fontFamily: fonts.titleLarge.fontFamily,
        fontSize: fonts.titleLarge.fontSize,
      },
      brandedSubtitle: {
        color: colors.onPrimary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      title: {
        color: colors.onBackground,
        fontFamily: fonts.titleLarge.fontFamily,
        fontSize: fonts.titleLarge.fontSize,
      },
      subtitle: {
        color: colors.onBackground,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      disabled: {
        backgroundColor: colors.surfaceDisabled,
        opacity: 0.3,
      },
    }),
    [fonts, colors],
  );
};
