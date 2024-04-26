import {
  combineReducers,
  configureStore,
  type Middleware,
} from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { persistReducer, persistStore } from 'redux-persist';

import { apiSlice } from '../api';

import { generateMMKVStorage } from './mmkv';
import { authSlice } from './slices/authSlice';
import { userSlice } from './slices/userSlice';

const middlewares: Middleware[] = [];

if (__DEV__ && Platform.OS !== 'ios') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

const rootReducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [userSlice.reducerPath]: userSlice.reducer,
});

middlewares.push(apiSlice.middleware);

export const generateStore = (encriptionKey: string) => {
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
