import { env } from '../env';

import { PublicScreen } from '@/screens/Routing/Public/types';

export enum RouteParams {
  userID = 'userID',
  verificationToken = 'verificationToken',
}

export const linking = {
  prefixes: [
    `${env.DEEP_LINKING_DOMAIN}://`,
    `https://${env.DEEP_LINKING_DOMAIN}/`,
  ],
  config: {
    screens: {
      [PublicScreen.VerifyEmail]: `/user/:${RouteParams.userID}/email/:${RouteParams.verificationToken}`,
      [PublicScreen.ResetPassword]: `/user/:${RouteParams.userID}/password/reset/:${RouteParams.verificationToken}`,
    },
  },
};
