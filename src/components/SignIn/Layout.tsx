import { type ReactNode } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles';

type LayoutProps = {
  environment?: string;
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ environment, children }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.LayoutContainer}>
        {children}
        <View style={styles.environmentPrompt}>
          <Text style={styles.environmentPromptText}>{environment}</Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  LayoutContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
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
