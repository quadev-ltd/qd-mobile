import { ScrollView, SafeAreaView, StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTheme } from 'react-native-paper';

import CTA from '@/components/CTA';
import Header from '@/components/Header';

interface AnalysisResultProps {
  text: string;
  goBack: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ text, goBack }) => {
  const { fonts, colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header title="Analysis result" />
        <Markdown
          style={{
            body: {
              color: colors.onBackground,
              fontFamily: fonts.bodyLarge.fontFamily,
              fontSize: fonts.bodyLarge.fontSize,
            },
          }}>
          {text}
        </Markdown>
        <View style={styles.ctaContainer}>
          <CTA text="Go back" accessibilityLabel="Go back" onPress={goBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  ctaContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default AnalysisResult;
