import { encode } from 'base-64';
import * as Keychain from 'react-native-keychain';
import { generateSecureRandom } from 'react-native-securerandom';

const MMKV_ENCRYPTION_KEY = 'mmkv_encryption_key';

export type PersistKey = {
  isFresh: boolean;
  key: string;
};

export const getMMKVEncryptionKey: () => Promise<
  string | undefined
> = async () => {
  const existingCredentials = await Keychain.getInternetCredentials(
    MMKV_ENCRYPTION_KEY
  );
  if (existingCredentials) {
    return existingCredentials.password;
  }
  const randomBytes = (await generateSecureRandom(32)).toString();
  const randomBytesStringToBase64 = encode(randomBytes);
  const hasSetCredentials = await Keychain.setInternetCredentials(
    MMKV_ENCRYPTION_KEY,
    randomBytesStringToBase64,
    randomBytesStringToBase64
  );
  if (hasSetCredentials) {
    return randomBytesStringToBase64;
  }
};
