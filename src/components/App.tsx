import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';

import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { i18n } from '../core/i18n/i18n.ts';
import { StoreProvider } from '../core/state/components/StoreProvider.tsx';

import { Landing } from './Landing.tsx';

export const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <StoreProvider>
        {({ store, persistor }) => (
          <Provider store={store}>
            <PersistGate
              loading={<ActivityIndicator size="large" color="#000000" />}
              persistor={persistor}>
              <Landing />
            </PersistGate>
          </Provider>
        )}
      </StoreProvider>
    </I18nextProvider>
  );
};
