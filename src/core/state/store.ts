import { configureStore, type Middleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

import { apiSlice, anomalyDetectionApiSlice } from '../api';

import { generateMMKVStorage } from './mmkv';
import { rootReducer } from './store/rootReducer';

const middlewares: Middleware[] = [];

middlewares.push(apiSlice.middleware);
middlewares.push(anomalyDetectionApiSlice.middleware);
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
