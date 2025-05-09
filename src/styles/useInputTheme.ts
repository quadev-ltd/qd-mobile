import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useInputTheme = () => {
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      input: {
        backgroundColor: colors.secondary,
        borderColor: colors.onSecondary,
        shadowColor: colors.shadow,
        color: colors.primary,
      },
      error: {
        color: colors.error,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      forgot: {
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
        color: colors.primary,
      },
    }),
    [fonts, colors],
  );

  return dynamicStyles;
};
