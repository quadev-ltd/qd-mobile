import {
  APIEndpoints,
  Methods,
  ParameterNames,
  type VerifyResetPasswordTokenRequest,
} from './types';

export const verifyPasswordResetTokenQuery = (
  data: VerifyResetPasswordTokenRequest,
) => {
  return {
    url: APIEndpoints.VerifyPasswordVerificationToken.replace(
      ParameterNames.UserID,
      data.userID,
    ).replace(ParameterNames.VerificationToken, data.verificationToken),
    method: Methods.GET,
  };
};
