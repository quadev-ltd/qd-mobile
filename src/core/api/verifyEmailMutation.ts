import {
  APIEndpoints,
  Methods,
  ParameterNames,
  type VerifyEmailRequest,
} from './types';

export const verifyEmailMutation = (data: VerifyEmailRequest) => {
  return {
    url: APIEndpoints.VerifyEmail.replace(
      ParameterNames.UserID,
      data.userID,
    ).replace(ParameterNames.VerificationToken, data.verificationToken),
    method: Methods.POST,
  };
};
