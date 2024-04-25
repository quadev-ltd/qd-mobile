import { APIEndpoints } from './constants';
import { Methods } from './types';

export const getUserProfileQuery = () => {
  return {
    url: APIEndpoints.GetUserProfile,
    method: Methods.GET,
  };
};
