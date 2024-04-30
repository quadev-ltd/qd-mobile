import {
  APIEndpoints,
  Methods,
  ParameterNames,
  type ResetPasswordRequest,
} from './types';

export const resetPasswordMutation = (data: ResetPasswordRequest) => {
  return {
    url: APIEndpoints.ResetPassword.replace(
      ParameterNames.UserID,
      data.userID,
    ).replace(ParameterNames.VerificationToken, data.verificationToken),
    method: Methods.POST,
    body: {
      password: data.password,
    },
  };
};
