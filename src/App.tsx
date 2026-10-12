import 'react-native-gesture-handler';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';

import { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { FlagsProvider } from './core/flags/FlagsProvider';
import { i18n } from './core/i18n/i18n';
import { setUpLogger } from './core/logger';
import { SessionProvider } from './core/session/SessionProvider';
import { createStore } from './core/state/store';
import Router from './screens/Routing/Router';
import { defaultTheme } from './styles/theme';

import { env } from '@/core/env';

setUpLogger(env.APPLICATION_ENVIRONMENT);

export const App = () => {
  const [store] = useState(createStore);
  return (
    <PaperProvider theme={defaultTheme}>
      <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <SessionProvider>
            <FlagsProvider>
              <SafeAreaProvider style={styles.container}>
                <Router
                  environment={env.APPLICATION_ENVIRONMENT}
                  applicationName={env.APPLICATION_NAME}
                />
                <Toast />
              </SafeAreaProvider>
            </FlagsProvider>
          </SessionProvider>
        </Provider>
      </I18nextProvider>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
