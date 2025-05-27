import { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export const useDividerDynamicStyles = () => {
  const { fonts, colors } = useTheme();
  return useMemo(
    () => ({
      divider: {
        borderColor: colors.secondary,
      },
      dividerText: {
        color: colors.secondary,
        fontSize: fonts.bodyLarge.fontSize,
        fontFamily: fonts.bodyLarge.fontFamily,
      },
    }),
    [fonts, colors],
  );
};
