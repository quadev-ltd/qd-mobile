import { APIEndpoints, type ForgotPasswordRequest, Methods } from './types';

export const forgotPasswordMutation = (body: ForgotPasswordRequest) => {
  return {
    body,
    url: APIEndpoints.RequestPasswordReset,
    method: Methods.POST,
  };
};
