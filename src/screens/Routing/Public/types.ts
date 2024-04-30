import { type RouteParams } from '@/core/deepLinking';

export enum PublicScreen {
  Landing = 'Landing',
  SignIn = 'Login',
  SignUp = 'Register',
  ForgotPassword = 'ForgotPassword',
  ResetPassword = 'ResetPassword',
  VerifyEmail = 'VerifyEmail',
}

export type StackParamList = {
  [PublicScreen.Landing]: { environment?: string };
  [PublicScreen.SignIn]: {
    manualSignIn?: boolean;
  };
  [PublicScreen.SignUp]: undefined;
  [PublicScreen.ForgotPassword]: {
    email?: string;
  };
  [PublicScreen.ResetPassword]: {
    [RouteParams.userID]: string;
    [RouteParams.verificationToken]: string;
  };
  [PublicScreen.VerifyEmail]: {
    applicationName: string;
    firstName?: string;
    [RouteParams.userID]: string;
    [RouteParams.verificationToken]?: string;
  };
};
