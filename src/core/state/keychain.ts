import { encode } from 'base-64';
import * as Keychain from 'react-native-keychain';
import { generateSecureRandom } from 'react-native-securerandom';

import logger from '../logger';

export const MMKV_ENCRYPTION_KEY = 'MMKV_ENCRYPTION_KEY';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';

export type PersistKey = {
  isFresh: boolean;
  key: string;
};

export const getMMKVEncryptionKey: () => Promise<
  string | undefined
> = async () => {
  const existingCredentials =
    await Keychain.getInternetCredentials(MMKV_ENCRYPTION_KEY);
  if (existingCredentials) {
    return existingCredentials.password;
  }
  const randomBytes = (await generateSecureRandom(32)).toString();
  const randomBytesStringToBase64 = encode(randomBytes);
  const hasSetCredentials = await Keychain.setInternetCredentials(
    MMKV_ENCRYPTION_KEY,
    randomBytesStringToBase64,
    randomBytesStringToBase64,
  );
  if (hasSetCredentials) {
    return randomBytesStringToBase64;
  }
};

// Function to store the access token
export const storeAuthToken = async (authToken: string) => {
  try {
    await Keychain.setGenericPassword(ACCESS_TOKEN, authToken, {
      service: ACCESS_TOKEN,
    });
  } catch (error) {
    logger().logError(error as Error);
  }
};

// Function to store the refresh token
export const storeRefreshToken = async (refreshToken: string) => {
  try {
    await Keychain.setGenericPassword(REFRESH_TOKEN, refreshToken, {
      service: REFRESH_TOKEN,
    });
  } catch (error) {
    logger().logError(error as Error);
  }
};

// Function to retrieve the access token
export const retrieveAuthToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: ACCESS_TOKEN,
    });
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  } catch (error) {
    logger().logError(error as Error);
    return null;
  }
};

// Function to retrieve the refresh token
export const retrieveRefreshToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN,
    });
    if (credentials) {
      return credentials.password;
    } else {
      return null;
    }
  } catch (error) {
    logger().logError(error as Error);
    return null;
  }
};

// Function to delete the access token
export const deleteAuthToken = async () => {
  try {
    await Keychain.resetGenericPassword({ service: ACCESS_TOKEN });
  } catch (error) {
    logger().logError(error as Error);
  }
};

// Function to delete the refresh token
export const deleteRefreshToken = async () => {
  try {
    await Keychain.resetGenericPassword({ service: REFRESH_TOKEN });
  } catch (error) {
    logger().logError(error as Error);
  }
};
