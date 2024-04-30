import {
  APIEndpoints,
  Methods,
  type SignUpRequest as SignUpRequest,
} from './types';

export const signUpMutation = (userDetails: SignUpRequest) => {
  return {
    url: APIEndpoints.SignUp,
    method: Methods.POST,
    body: userDetails,
  };
};
