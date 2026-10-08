export enum PublicScreen {
  Landing = 'Landing',
  SignIn = 'Login',
  SignUp = 'Register',
  ForgotPassword = 'ForgotPassword',
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
};
