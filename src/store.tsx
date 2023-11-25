import {
  combineReducers,
  configureStore,
  Middleware,
} from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import { Platform } from 'react-native';
import { Persistor, persistReducer, persistStore } from 'redux-persist';

import { generateMMKVStorage } from './mmkv';
import test from './test-slice';

const middlewares: Middleware[] = [];

if (__DEV__ && Platform.OS !== 'ios') {
  // Execution needs to be synchronous
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}


const rootReducer = combineReducers({
  test: test,
});

export type RootState = ReturnType<typeof rootReducer>;

export const generateStore = (encriptionKey: string): { store: ToolkitStore, persistor: Persistor } => {
  const reduxMMKVStorage = generateMMKVStorage('persist.easydriver.com', encriptionKey);
  const persistConfig = {
    key: 'root',
    storage: reduxMMKVStorage,
    blacklist: ['auth']
  }
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(middlewares),
  })
  const persistor = persistStore(store);
  return { store, persistor };
}