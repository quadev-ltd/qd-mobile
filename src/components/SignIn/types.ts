import { type SignInSchemaType } from '@/schemas/signInSchema';
import { type SignUpSchemaType } from '@/schemas/signUpSchema';

export enum ScreenType {
  SignIn = 'signIn',
  SignUp = 'signUp',
  ForgotPassword = 'forgotPassword',
  Landing = 'landing',
  EmailVerification = 'emailVerification',
  ResetPassword = 'resetPassword',
}

export type FormSchema = SignUpSchemaType | SignInSchemaType;

export type FieldType = keyof FormSchema;
