import { type Store } from '@reduxjs/toolkit';
import { type FC, useEffect, useState } from 'react';
import { type Persistor } from 'redux-persist';

import { getMMKVEncryptionKey } from '../keychain.ts';
import { generateStore } from '../store.ts';

import AppLoading from '@/components/AppLoading.tsx';

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
      console.error('There has been an error loading the store:', error);
      throw error;
    });
  }, []);

  if (!storeDetails) {
    return <AppLoading />;
  }

  return children(storeDetails);
};
