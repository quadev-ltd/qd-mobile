import { APIEndpoints } from './constants';
import { type SignUpFormType } from './types';

export const signUpMutation = (userDetails: SignUpFormType) => {
  return {
    url: APIEndpoints.SignUp,
    method: 'POST',
    body: userDetails,
  };
};
