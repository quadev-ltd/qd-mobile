import { type ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { LayoutPaddingVertical } from './constants';

import { colors } from '@/styles/common';

type LayoutProps = {
  environment?: string;
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ environment, children }) => {
  return (
    <View style={styles.LayoutContainer}>
      {children}
      <View style={styles.environmentPrompt}>
        <Text style={styles.environmentPromptText}>{environment}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  LayoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    paddingVertical: LayoutPaddingVertical,
    paddingHorizontal: 40,
    backgroundColor: colors.purpleBlue,
  },
  environmentPrompt: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  environmentPromptText: {
    color: colors.white,
    fontSize: 16,
  },
});
