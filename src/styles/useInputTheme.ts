import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useInputTheme = () => {
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      input: {
        backgroundColor: colors.tertiary,
        borderColor: colors.onTertiary,
        shadowColor: colors.shadow,
      },
      error: {
        color: colors.error,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
      forgot: {
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
        color: colors.secondary,
      },
    }),
    [fonts, colors],
  );

  return dynamicStyles;
};
