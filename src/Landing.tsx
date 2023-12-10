import React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from './store';
import { toggle } from './test-slice';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
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

function Landing(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const flag = useSelector((state: RootState) => state.test.isOn);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const toggleFlag = () => dispatch(toggle())

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
          <Section title="QD Mobile">
            <Text>
              QuaDev Mobile App.
            </Text>
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
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
                  pressed && styles.buttonPressed
                ]
              }
                onPress={toggleFlag}
              >
                <Text style={styles.buttonText}>Toggle flag</Text>
              </Pressable>
              <Text style={styles.sectionDescription}>Test flag is: <Text style={styles.bold}>{flag ? 'on' : 'off'}</Text></Text>
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

export default Landing;
