import { APIEndpoints } from "./constants";

export interface RegisterUserResponse {
    success: boolean;
    message: string;
}

export interface SignUpFormType {
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: number;
    password: string;
    password_confirmation: string;
}
export const signUpMutation = (userDetails: SignUpFormType) => {
  console.log('userDetails', userDetails);
  return ({
    url: APIEndpoints.SignUp,
    method: 'POST',
    body: userDetails,
  });
}