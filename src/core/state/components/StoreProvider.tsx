import { UnknownAction, type Store } from '@reduxjs/toolkit';
import { type FC, useEffect, useState } from 'react';
import { type Persistor } from 'redux-persist';

import { getMMKVEncryptionKey } from '../keychain.ts';
import { generateStore } from '../store.ts';

import AppLoading from '@/components/AppLoading.tsx';
import { loadInitialToken } from '../slices/authSlice.tsx';
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
      logger().logError(Error(`There has been an error loading the store: ${error}`));
      throw error;
    });
  }, []);

  useEffect(() => {
    storeDetails
      && storeDetails.store.dispatch((loadInitialToken() as unknown) as UnknownAction);
  }, [storeDetails]);

  if (!storeDetails) {
    return <AppLoading />;
  }

  return children(storeDetails);
};
