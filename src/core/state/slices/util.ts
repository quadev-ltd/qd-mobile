import { decode } from 'base-64';

import { type TokenPayload } from './types';

export const jwtDecode = (token: string): TokenPayload => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT: The token must consist of three parts.');
    }
    const payload = parts[1];
    const decodedPayload = decode(payload);
    const parsedPayload = JSON.parse(decodedPayload);
    return parsedPayload;
  } catch (error) {
    throw `Failed to decode JWT: ${error}`;
  }
};
