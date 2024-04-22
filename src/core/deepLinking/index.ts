import { env } from '../env';

import { PublicScreen } from '@/screens/Routing/Public/types';

export const linking = {
  prefixes: [
    `${env.DEEP_LINKING_DOMAIN}://`,
    `https://${env.DEEP_LINKING_DOMAIN}/`,
  ],
  config: {
    screens: {
      [PublicScreen.VerifyEmail]:
        '/api/v1/user/:userID/email/:verificationToken',
    },
  },
};
