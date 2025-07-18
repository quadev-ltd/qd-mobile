import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { fonts, colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.textContainer}>
        <ScrollView scrollEnabled={true}>
          <Header title={t('detectAnomaly.analysisResult')} />
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
        </ScrollView>
      </View>
      <CTA
        text={t('detectAnomaly.goBack')}
        accessibilityLabel="Go back"
        onPress={goBack}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignSelf: 'stretch',
    padding: 24,
  },
  textContainer: {
    flex: 1,
  },
});

export default AnalysisResult;
