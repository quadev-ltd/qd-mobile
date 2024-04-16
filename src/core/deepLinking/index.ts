import { Screen } from '@/screens/Routing/types';

export const linking = {
  prefixes: ['quadevdomain://', 'https://quadevdomain.com'],
  config: {
    screens: {
      [Screen.VerifyEmail]: 'user/:userID/verify/:verificationToken',
    },
  },
};
