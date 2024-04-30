import { APIEndpoints, Methods } from './types';

export const getUserProfileQuery = () => {
  return {
    url: APIEndpoints.GetUserProfile,
    method: Methods.GET,
  };
};
