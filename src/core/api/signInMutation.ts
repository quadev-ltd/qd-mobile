import { APIEndpoints } from './constants';
import { Methods, type SignInRequest } from './types';

export const signInMutation = (userDetails: SignInRequest) => {
  return {
    url: APIEndpoints.SignIn,
    method: Methods.POST,
    body: userDetails,
  };
};
