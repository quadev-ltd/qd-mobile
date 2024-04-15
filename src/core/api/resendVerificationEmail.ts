import { APIEndpoints, ParameterNames } from './constants';
import { type ResendVerificationRequest } from './types';

export const resendVerificationEmailMutation = (
  data: ResendVerificationRequest,
) => {
  return {
    url: APIEndpoints.ResendVerificationEmail.replace(
      ParameterNames.UserID,
      data.userID,
    ),
    method: 'POST',
  };
};
