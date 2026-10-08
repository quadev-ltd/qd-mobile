import { type LinkingOptions } from '@react-navigation/native';

import { env } from '../env';

// Email verification and password reset open Firebase's hosted pages, so no screen is linked any
// more. The prefixes are kept for future deep links (the custom scheme is still registered).
export const linking: LinkingOptions<object> = {
  prefixes: [
    `${env.DEEP_LINKING_DOMAIN}://`,
    `https://${env.DEEP_LINKING_DOMAIN}/`,
  ],
};
