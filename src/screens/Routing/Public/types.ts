export enum PublicScreen {
  Landing = 'Landing',
  SignIn = 'Login',
  SignUp = 'Register',
  ForgotPassword = 'ForgotPassword',
  VerifyEmail = 'VerifyEmail',
}

export type StackParamList = {
  [PublicScreen.Landing]: { environment?: string };
  [PublicScreen.SignIn]: undefined;
  [PublicScreen.SignUp]: undefined;
  [PublicScreen.ForgotPassword]: undefined;
  [PublicScreen.VerifyEmail]: {
    applicationName: string;
    firstName?: string;
    userID: string;
    verificationToken?: string;
  };
};
