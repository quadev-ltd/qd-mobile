import { type UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useSignUpMutation } from '..';
import {
  asynchErrorMessages,
  type RTKQueryErrorType,
  processError,
} from '../errors';
import { type ResponseError } from '../types';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import logger from '@/core/logger';
import { useAppDispatch } from '@/core/state/hooks';
import { setProfileDetails } from '@/core/state/slices/userSlice';
import { SignUpFields, type SignUpSchemaType } from '@/schemas/signUpSchema';
import { stringToDate, stringToGrpcTimestamp, trimFormData } from '@/util';

interface OnSuccessParams {
  userID: string;
  userName: string;
}

export const useSignUp = (
  onSuccess: (userData: OnSuccessParams) => void,
  setAsynchError: UseFormSetError<SignUpSchemaType>,
) => {
  const { t } = useTranslation();
  const [signUpUser, { isLoading }] = useSignUpMutation();
  const dispatch = useAppDispatch();

  const signUp = async (formData: SignUpSchemaType) => {
    try {
      const dob = stringToGrpcTimestamp(formData[SignUpFields.dob]);
      stringToDate(formData[SignUpFields.dob]).getTime();
      const parsedData = {
        ...formData,
        [SignUpFields.dob]: dob,
      };
      const trimmedFormData = trimFormData(parsedData);
      const userData = await signUpUser(trimmedFormData).unwrap();

      dispatch(setProfileDetails(userData.user));
      onSuccess({
        userID: userData.user.userID,
        userName: userData.user.firstName,
      });
    } catch (err) {
      const typedError = err as ResponseError;
      if (
        typedError.data?.field_errors &&
        typedError.data.field_errors.length > 0 &&
        typedError.status === 400
      ) {
        typedError.data?.field_errors?.forEach(fieldError => {
          const errorMessage = asynchErrorMessages(t, fieldError.error);
          if (!errorMessage) {
            logger().logError(
              Error(
                `Unknown registration error for email ${
                  formData[SignUpFields.email]
                }: ${JSON.stringify(err)}`,
              ),
            );
            return;
          }
          setAsynchError(
            fieldError.field as keyof SignUpSchemaType,
            {
              type: 'manual',
              message: errorMessage,
            },
            { shouldFocus: true },
          );
        });
      } else {
        processError(err as RTKQueryErrorType, t, {
          onUnmanagedError: errorMessage =>
            showErrorToast(t('error.errorTitle'), errorMessage),
          onUnexpectedError: () => showUnexpectedErrorToast(t),
          logErrorMessage: `Unknown registration error for email ${
            formData[SignUpFields.email]
          }: ${JSON.stringify(err)}`,
        });
      }
    }
  };

  return { signUp, isLoading };
};
