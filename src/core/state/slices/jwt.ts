import { decode } from 'base-64';

import { ClaimName, type TokenPayload } from './types';

import { secondsToDate } from '@/util';

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

export const getTokenExpiry = (token: string | null) => {
  if (token === null) {
    throw new Error('No refresh token found');
  }
  const decodedToken = jwtDecode(token);
  if (!decodedToken[ClaimName.ExpiryClaim]) {
    throw new Error('Token does not contain expiry claim');
  }
  return secondsToDate(decodedToken[ClaimName.ExpiryClaim]);
};
