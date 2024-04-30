import { APIEndpoints, Methods } from './types';

export const resendVerificationEmailMutation = () => {
  return {
    url: APIEndpoints.RefreshToken,
    method: Methods.POST,
  };
};
