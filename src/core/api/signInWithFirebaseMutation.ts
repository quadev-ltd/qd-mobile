import { APIEndpoints, Methods, type SignInWithFirebseRequest } from './types';

export const signInWithFirebaseMutation = (
  userDetails: SignInWithFirebseRequest,
) => {
  return {
    url: APIEndpoints.SignInWithFirebase,
    method: Methods.POST,
    body: userDetails,
  };
};
