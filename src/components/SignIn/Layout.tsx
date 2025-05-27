import { type ReactNode } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type LayoutProps = {
  environment?: string;
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ environment, children }) => {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.LayoutContainer, { backgroundColor: colors.primary }]}>
      {children}
      <View style={styles.environmentPrompt}>
        <Text
          style={[styles.environmentPromptText, { color: colors.onPrimary }]}>
          {environment}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  LayoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    paddingHorizontal: 24,
  },
  environmentPrompt: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  environmentPromptText: {
    fontSize: 16,
  },
});
