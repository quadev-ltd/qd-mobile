import {
  combineReducers,
  configureStore,
  type EnhancedStore,
  type Middleware,
} from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { type Persistor, persistReducer, persistStore } from 'redux-persist';

import { apiSlice } from '../api';

import { generateMMKVStorage } from './mmkv.ts';

const middlewares: Middleware[] = [];

if (__DEV__ && Platform.OS !== 'ios') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
});

middlewares.push(apiSlice.middleware);

export const generateStore = (
  encriptionKey: string,
): { store: EnhancedStore; persistor: Persistor } => {
  const reduxMMKVStorage = generateMMKVStorage(
    'persist.qdmobile.com',
    encriptionKey,
  );
  const persistConfig = {
    key: 'root',
    storage: reduxMMKVStorage,
    blacklist: ['auth'],
  };
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
  });
  const persistor = persistStore(store);
  return { store, persistor };
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ReturnType<typeof generateStore>['store']['dispatch'];
