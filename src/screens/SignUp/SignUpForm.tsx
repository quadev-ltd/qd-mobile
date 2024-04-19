import { zodResolver } from '@hookform/resolvers/zod';
import { type TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';

import { AsynchErrorMessages } from '../../core/api/constants';

import { CTA } from '@/components/CTA';
import { commonStyles } from '@/components/SignIn/constants';
import { HookFormDateInput } from '@/components/SignIn/HookFormDateInput';
import { HookFormPasswordInput } from '@/components/SignIn/HookFormPasswordInput';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import Spinner from '@/components/Spinner';
import { useRegisterUserMutation } from '@/core/api';
import { type ResponseError } from '@/core/api/types';
import Logger from '@/core/logger';
import {
  SignUpFields,
  type SignUpSchemaType,
  signUpSchema,
} from '@/schemas/signUpSchema';
import { stringToDate, stringToGrpcTimestamp } from '@/util';

interface SignUpFormProps {
  onSuccess: (userData: { userName: string; userID: string }) => void;
}

const showUnexpectedErrorToast = (t: TFunction<'translation'>) => {
  Toast.show({
    type: 'error',
    text1: t('signUp.genericError'),
    text2: t('signUp.genericErrorDescription'),
    position: 'bottom',
  });
};

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(signUpSchema) });
  const { t } = useTranslation();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const password = watch('password');

  const onSubmit = async (formData: SignUpSchemaType) => {
    try {
      const dob = stringToGrpcTimestamp(formData[SignUpFields.dob]);
      stringToDate(formData[SignUpFields.dob]).getTime();
      const parsedData = {
        ...formData,
        [SignUpFields.dob]: dob,
      };
      const userData = await registerUser(parsedData).unwrap();

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
        (err as ResponseError).data?.field_errors?.forEach(fieldError => {
          const errorMessage = AsynchErrorMessages[fieldError.error];
          if (!errorMessage) {
            Logger().logError(
              Error(`Unknown registration error for email ${formData[SignUpFields.email]}: ${JSON.stringify(err)}`),
            );
            showUnexpectedErrorToast(t);
            return;
          }
          setError(
            fieldError.field as keyof SignUpSchemaType,
            {
              type: 'manual',
              message: errorMessage,
            },
            { shouldFocus: true },
          );
        });
      } else {
        Logger().logError(
          Error(`Unknown registration error for email ${formData[SignUpFields.email]}: ${JSON.stringify(err)}`),
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
        label={t('signUp.emailLabel')}
        accessibilityLabel={t('signUp.emailAccessibilityLabel')}
        name={SignUpFields.email}
        control={control}
        error={errors[SignUpFields.email]}
      />
      <HookFormTextInput
        label={t('signUp.firstNameLabel')}
        accessibilityLabel={t('signUp.firstNameAccessibilityLabel')}
        name={SignUpFields.firstName}
        control={control}
        error={errors[SignUpFields.firstName]}
      />
      <HookFormTextInput
        label={t('signUp.lastNameLabel')}
        accessibilityLabel={t('signUp.lastNameAccessibilityLabel')}
        name={SignUpFields.lastName}
        control={control}
        error={errors[SignUpFields.lastName]}
      />
      <HookFormDateInput
        label={t('signUp.dobLabel')}
        accessibilityLabel={t('signUp.dobAccessibilityLabel')}
        name={SignUpFields.dob}
        control={control}
        error={errors[SignUpFields.dob]}
      />
      <HookFormPasswordInput
        name={SignUpFields.password}
        password={password}
        control={control}
        error={errors[SignUpFields.password]}
      />
      <HookFormTextInput
        label={t('signUp.passwordConfirmationLabel')}
        accessibilityLabel={t('signUp.passwordConfirmationAccessibilityLabel')}
        name={SignUpFields.passwordConfirmation}
        control={control}
        error={errors[SignUpFields.passwordConfirmation]}
        secureTextEntry={true}
      />
      <View style={styles.tAndCContainer}>
        <Text style={styles.tAndCText} adjustsFontSizeToFit>
          {t('signUp.termsLabel')}
          <Text style={styles.termsLink}>{t('signUp.termsOfService')}</Text>&
          <Text style={styles.termsLink}>{t('signUp.privacyPolicy')}</Text>
        </Text>
      </View>

      <View style={commonStyles.footerButton}>
        <CTA
          text={t(`signUp.submitButton`)}
          accessibilityLabel={t(`signUp.submitButtonAccessibilityLabel`)}
          onPress={handleOnSubmit}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tAndCContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tAndCText: {
    flex: 1,
    fontSize: 12,
    alignSelf: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
