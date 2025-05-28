import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useInputDynamicStyles = () => {
  const { fonts, colors } = useTheme();
  return useMemo(
    () => ({
      input: {
        backgroundColor: colors.tertiary,
        borderColor: colors.onTertiary,
        shadowColor: colors.shadow,
        color: colors.secondary,
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
};
