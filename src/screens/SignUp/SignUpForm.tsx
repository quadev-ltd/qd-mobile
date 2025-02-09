import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Keyboard } from 'react-native';

import { Terms } from './Terms';

import CTA from '@/components/CTA';
import { HookFormDateInput } from '@/components/SignIn/HookFormDateInput';
import { HookFormPasswordInput } from '@/components/SignIn/HookFormPasswordInput';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import Spinner from '@/components/Spinner';
import { useSignUp } from '@/core/api/hooks/useSignUp';
import { SignUpFields, type SignUpSchemaType } from '@/schemas/signUpSchema';

interface SignUpFormProps {
  onSuccess: (userData: { userName: string; userID: string }) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useFormContext<SignUpSchemaType>();
  const { t } = useTranslation();
  const { signUp, isLoading } = useSignUp(onSuccess, setError);

  const password = watch('password');

  const handleOnSubmit = () => {
    handleSubmit(signUp)();
    Keyboard.dismiss();
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
        onSubmitEditing={handleOnSubmit}
        keyboardType="email-address"
      />
      <HookFormTextInput
        label={t('signUp.firstNameLabel')}
        accessibilityLabel={t('signUp.firstNameAccessibilityLabel')}
        name={SignUpFields.firstName}
        control={control}
        error={errors[SignUpFields.firstName]}
        onSubmitEditing={handleOnSubmit}
        keyboardType="default"
      />
      <HookFormTextInput
        label={t('signUp.lastNameLabel')}
        accessibilityLabel={t('signUp.lastNameAccessibilityLabel')}
        name={SignUpFields.lastName}
        control={control}
        error={errors[SignUpFields.lastName]}
        onSubmitEditing={handleOnSubmit}
        keyboardType="default"
      />
      <HookFormDateInput
        label={t('signUp.dobLabel')}
        accessibilityLabel={t('signUp.dobAccessibilityLabel')}
        name={SignUpFields.dob}
        control={control}
        error={errors[SignUpFields.dob]}
        onSubmitEditing={handleOnSubmit}
      />
      <HookFormPasswordInput
        label={t('signUp.passwordLabel')}
        accessibilityLabel={t('signUp.passwordAccessibilityLabel')}
        name={SignUpFields.password}
        password={password}
        control={control}
        error={errors[SignUpFields.password]}
        passwordConfirmationField={{
          label: t('signUp.passwordConfirmationLabel'),
          accessibilityLabel: t(
            'signUp.passwordConfirmationAccessibilityLabel',
          ),
          name: SignUpFields.passwordConfirmation,
          error: errors[SignUpFields.passwordConfirmation],
        }}
        onSubmitEditing={handleOnSubmit}
      />
      <Terms />
      <View style={styles.footerButton}>
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
  footerButton: {
    marginBottom: 12,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'stretch',
  },
});
