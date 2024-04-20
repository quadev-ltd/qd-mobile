import { PublicScreen } from '@/screens/Routing/Public/types';

export const linking = {
  prefixes: ['quadevdomain://', 'https://quadevdomain.com'],
  config: {
    screens: {
      [PublicScreen.VerifyEmail]: 'user/:userID/email/:verificationToken',
    },
  },
};
