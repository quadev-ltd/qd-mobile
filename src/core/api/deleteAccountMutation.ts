import { APIEndpoints, Methods } from './types';

export const deleteAccountMutation = () => {
  return {
    url: APIEndpoints.DeleteAccount,
    method: Methods.DELETE,
  };
};
