export enum Screen {
  Landing = 'Landing',
  SignIn = 'Login',
  SignUp = 'Register',
  ForgotPassword = 'ForgotPassword',
  VerifyEmail = 'VerifyEmail',
}

export type StackParamList = {
  [Screen.Landing]: { environment?: string };
  [Screen.SignIn]: undefined;
  [Screen.SignUp]: undefined;
  [Screen.ForgotPassword]: undefined;
  [Screen.VerifyEmail]: {
    applicationName: string;
    firstName?: string;
    userID: string;
    verificationToken?: string;
  };
};
