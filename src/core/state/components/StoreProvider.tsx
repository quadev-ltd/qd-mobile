import { type UnknownAction, type Store } from '@reduxjs/toolkit';
import { type FC, useEffect, useState } from 'react';
import { type Persistor } from 'redux-persist';

import { getMMKVEncryptionKey } from '../keychain';
import { loadInitialToken } from '../slices/authSlice';
import { generateStore } from '../store';

import AppLoading from '@/components/AppLoading';
import logger from '@/core/logger';

interface StoreDetails {
  store: Store;
  persistor: Persistor;
}
interface IProps {
  children: (args: StoreDetails) => JSX.Element;
}

export const StoreProvider: FC<IProps> = ({ children }) => {
  const [storeDetails, setStoreDetails] = useState<StoreDetails | undefined>(
    undefined,
  );
  const initMMKV = async () => {
    const mmkvEncryptionKey = await getMMKVEncryptionKey();
    if (mmkvEncryptionKey) {
      setStoreDetails(generateStore(mmkvEncryptionKey));
    }
  };

  useEffect(() => {
    initMMKV().catch(error => {
      logger().logError(
        Error(`There has been an error loading the store: ${error}`),
      );
      throw error;
    });
  }, []);

  useEffect(() => {
    storeDetails &&
      storeDetails.store.dispatch(
        loadInitialToken() as unknown as UnknownAction,
      );
  }, [storeDetails]);

  if (!storeDetails) {
    return <AppLoading />;
  }

  return children(storeDetails);
};

export default StoreProvider;
