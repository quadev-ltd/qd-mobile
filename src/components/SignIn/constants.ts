import { StyleSheet } from 'react-native';

export const LayoutPaddingVertical = 70;
export const FooterPromptHeight = 20;
export const FooterPromptTopMargin = 8;

export const commonStyles = StyleSheet.create({
  footerButton: {
    marginBottom: FooterPromptHeight + FooterPromptTopMargin,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'stretch',
  },
});
