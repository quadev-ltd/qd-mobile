import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/Header';
import Spinner from '@/components/Spinner';

const windowHeight = Dimensions.get('window').height;

interface ScreenLayoutProps {
  children?: React.ReactNode;
  isSubmitting: boolean;
  keyboardOffset?: number;
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  isSubmitting,
  keyboardOffset,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, { height: windowHeight }]}
        style={[
          keyboardOffset
            ? [styles.keyboardOffset, { top: -keyboardOffset }]
            : null,
          Platform.OS === 'android' && keyboardOffset
            ? styles.androidBottom
            : null,
        ]}>
        <Header
          title={
            isSubmitting
              ? t('detectAnomaly.analysing')
              : t('detectAnomaly.title')
          }
          titleAccessibilityLabel={
            isSubmitting
              ? t('detectAnomaly.analysingAccessibilityLabel')
              : t('detectAnomaly.title')
          }
          subtitle={isSubmitting ? undefined : t('detectAnomaly.description')}
          subtitleAccessibilityLabel={
            isSubmitting ? undefined : t('detectAnomaly.description')
          }
        />
        {isSubmitting && <Spinner color={colors.onBackground} />}
        {children}
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
  keyboardOffset: {
    position: 'absolute',
  },
  androidBottom: {
    bottom: 0,
  },
});

export default ScreenLayout;
