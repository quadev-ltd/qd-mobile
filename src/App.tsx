import 'react-native-gesture-handler';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';

import { I18nextProvider } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppLoading from './components/AppLoading';
import { i18n } from './core/i18n/i18n';
import { setUpLogger } from './core/logger';
import StoreProvider from './core/state/components/StoreProvider';
import Router from './screens/Routing/Router';

import { env } from '@/core/env';

setUpLogger(env.APPLICATION_ENVIRONMENT);

export const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <StoreProvider>
        {({ store, persistor }) => (
          <Provider store={store}>
            <PersistGate loading={<AppLoading />} persistor={persistor}>
              <SafeAreaView style={styles.container}>
                <Router
                  environment={env.APPLICATION_ENVIRONMENT}
                  applicationName={env.APPLICATION_NAME}
                />
                <Toast />
              </SafeAreaView>
            </PersistGate>
          </Provider>
        )}
      </StoreProvider>
    </I18nextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
