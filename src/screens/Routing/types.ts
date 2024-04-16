export enum Screen {
  Landing = 'Landing',
  SignIn = 'Login',
  SignUp = 'Register',
  ForgotPassword = 'ForgotPassword',
  Wellcome = 'Wellcome',
  VerifyEmail = 'VerifyEmail',
}

export type StackParamList = {
  [Screen.Landing]: { environment?: string };
  [Screen.SignIn]: undefined;
  [Screen.SignUp]: undefined;
  [Screen.ForgotPassword]: undefined;
  [Screen.Wellcome]: {
    applicationName?: string;
    firstName: string;
    userID: string;
  };
  [Screen.VerifyEmail]: {
    userID: string;
    verificationToken: string;
  };
};
