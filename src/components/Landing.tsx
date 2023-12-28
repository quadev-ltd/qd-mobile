import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { useAppDispatch, useAppSelector } from '../core/state/hooks.ts';
import { type RootState } from '../core/state/store.ts';
import { toggle } from '../core/state/test-slice.ts';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

export function Landing(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const flag = useAppSelector((state: RootState) => state.test.isOn);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleFlag = () => dispatch(toggle());

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title={t('landing.appName')}>
            <Text>{t('landing.appDescription')}</Text>
          </Section>
          <Section title={t('landing.instructionsTitle')}>
            <ReloadInstructions />
          </Section>
          <Section title={t('landing.debugTitle')}>
            <DebugInstructions />
          </Section>

          <View style={styles.sectionContainer}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: isDarkMode ? Colors.white : Colors.black,
                },
              ]}>
              {t('landing.testReduxTitle')}
            </Text>
            <Text
              style={[
                styles.sectionDescription,
                {
                  color: isDarkMode ? Colors.light : Colors.dark,
                },
              ]}>
              {t('landing.testReduxDescription')}
            </Text>
            <View style={styles.buttonContainer}>
              <Pressable
                style={({ pressed }: { pressed: boolean }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
                onPress={toggleFlag}>
                <Text style={styles.buttonText}>{t('landing.flagTitle')}</Text>
              </Pressable>
              <Text style={styles.sectionDescription}>
                {t('landing.flagTitle')}
                <Text style={styles.bold}>
                  {flag ? t('landing.flagOn') : t('landing.flagOff')}
                </Text>
              </Text>
            </View>
          </View>

          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    color: Colors.black,
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  button: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
  buttonPressed: {
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});
