import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Keyboard } from 'react-native';

import { AsynchErrorMessages } from '../../core/api/constants';

import { CTA } from '@/components/CTA';
import { HookFormPasswordInput } from '@/components/SignIn/HookFormPasswordInput';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import Spinner from '@/components/Spinner';
import { showUnexpectedErrorToast } from '@/components/Toast';
import { useSignInMutation } from '@/core/api';
import { type ResponseError } from '@/core/api/types';
import Logger from '@/core/logger';
import {
  SignInFields,
  type SignInSchemaType,
  signInSchema,
} from '@/schemas/signInSchema';
import { trimFormData } from '@/util';

interface SignInFormProps {
  onSuccess: (userData: { authToken: string; refreshToken: string }) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<SignInSchemaType>({ resolver: zodResolver(signInSchema) });
  const { t } = useTranslation();
  const [registerUser, { isLoading }] = useSignInMutation();
  const password = watch('password');

  const onSubmit = async (formData: SignInSchemaType) => {
    try {
      const trimmedFormData = trimFormData(formData);
      const userData = await registerUser(trimmedFormData).unwrap();
      onSuccess(userData);
    } catch (err) {
      const typedError = err as ResponseError;
      if (
        typedError.data?.field_errors &&
        typedError.data.field_errors.length > 0 &&
        typedError.status === 400
      ) {
        (err as ResponseError).data?.field_errors?.forEach(fieldError => {
          const errorMessage = AsynchErrorMessages[fieldError.error];
          if (!errorMessage) {
            Logger().logError(
              Error(
                `Unknown registration error for email ${
                  formData[SignInFields.email]
                }: ${JSON.stringify(err)}`,
              ),
            );
            showUnexpectedErrorToast(t);
            return;
          }
          setError(
            fieldError.field as keyof SignInSchemaType,
            {
              type: 'manual',
              message: errorMessage,
            },
            { shouldFocus: true },
          );
        });
      } else {
        Logger().logError(
          Error(
            `Unknown registration error for email ${
              formData[SignInFields.email]
            }: ${JSON.stringify(err)}`,
          ),
        );
        showUnexpectedErrorToast(t);
      }
    }
  };
  const handleOnSubmit = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <HookFormTextInput
        label={t('signIn.emailLabel')}
        accessibilityLabel={t('signIn.emailAccessibilityLabel')}
        name={SignInFields.email}
        control={control}
        error={errors[SignInFields.email]}
      />

      <HookFormPasswordInput
        name={SignInFields.password}
        password={password}
        control={control}
        error={errors[SignInFields.password]}
      />
      <View style={styles.footerButton}>
        <CTA
          text={t(`signIn.submitButton`)}
          accessibilityLabel={t(`signIn.submitButtonAccessibilityLabel`)}
          onPress={handleOnSubmit}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  footerButton: {
    marginBottom: 12,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'stretch',
  },
});
