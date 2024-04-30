import { APIEndpoints, Methods, type SignInRequest } from './types';

export const signInMutation = (userDetails: SignInRequest) => {
  return {
    url: APIEndpoints.SignIn,
    method: Methods.POST,
    body: userDetails,
  };
};
