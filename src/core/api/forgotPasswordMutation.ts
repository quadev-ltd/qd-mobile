import { APIEndpoints, type ForgotPasswordRequest, Methods } from './types';

export const forgotPasswordMutation = (data: ForgotPasswordRequest) => {
  return {
    body: data,
    url: APIEndpoints.RequestPasswordReset,
    method: Methods.POST,
  };
};
