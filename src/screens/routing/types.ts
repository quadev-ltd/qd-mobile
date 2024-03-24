export enum Screen {
  Landing = 'Landing',
  SignIn = 'Login',
  SignUp = 'Register',
  ForgotPassword = 'ForgotPassword',
}

export type StackParamList = {
  [Screen.Landing]: { environment?: string };
  [Screen.SignIn]: undefined;
  [Screen.SignUp]: undefined;
  [Screen.ForgotPassword]: undefined;
};
