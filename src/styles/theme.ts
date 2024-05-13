import { DefaultTheme } from 'react-native-paper';

import { colors } from './colors';

export const defaultTheme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    primary: colors.purpleBlue,
    onPrimary: colors.white,
    secondary: colors.black,
    onSecondary: colors.white,
    tertiary: colors.white,
    onTertiary: colors.grey,
    background: colors.purpleBlue,
    card: colors.purpleBlue,
    text: colors.black,
    border: colors.black,
    notification: colors.red,
    error: colors.red,
    shadow: colors.black,
  },
};
