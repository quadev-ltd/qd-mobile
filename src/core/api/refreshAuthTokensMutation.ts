import { APIEndpoints, Methods, type RefreshAuthTokensRequest } from './types';

export const refreshAuthTokensMutation = (data: RefreshAuthTokensRequest) => {
  return {
    url: APIEndpoints.RefreshAuthTokens,
    method: Methods.POST,
    headers: {
      // The refresh token is sent in the Authorization header
      // This is not overwritten in prepareHeaders function
      Authorization: `Bearer ${data.refreshToken}`,
    },
  };
};
