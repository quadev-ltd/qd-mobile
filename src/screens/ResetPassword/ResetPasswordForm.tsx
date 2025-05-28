import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import ResetPasswordStatus from './ResetPasswordStatus';

import CTA from '@/components/CTA';
import { HookFormPasswordInput } from '@/components/HookFormInputs/HookFormPasswordInput';
import BrandedSubtitle from '@/components/SignIn/BrandedSubtitle';
import { useResetPassword } from '@/core/api/hooks/useResetPassword';
import { useRedirectToSignInOnSuccess } from '@/hooks/useRedirectToSignInOnSuccess';
import {
  ResetPasswordFields,
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from '@/schemas/resetPasswordSchema';

export interface ResetPasswordFormProps {
  userID: string;
  verificationToken: string;
  sendAnotherResetLink: () => void;
  onSuccessGoToSignIn: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  userID,
  verificationToken,
  sendAnotherResetLink,
  onSuccessGoToSignIn,
}) => {
  const { t } = useTranslation();
  const {
    isResetSuccess,
    isError,
    isLoading,
    errorMessage,
    resetPassword,
    tryAgain,
  } = useResetPassword(userID, verificationToken);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
  });
  useRedirectToSignInOnSuccess(isResetSuccess, onSuccessGoToSignIn);

  const password = watch(ResetPasswordFields.password);

  const handleOnSubmit = () => {
    handleSubmit(resetPassword)();
  };

  if (isError || isLoading || isResetSuccess) {
    return (
      <ResetPasswordStatus
        isLoading={isLoading}
        isSuccess={isResetSuccess}
        isError={isError}
        errorMessage={errorMessage}
        sendAnotherResetLink={sendAnotherResetLink}
        tryAgain={tryAgain}
      />
    );
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.formContainer}>
      <BrandedSubtitle
        text={t('resetPassword.subtitle')}
        accessibilityLabel={t('resetPasswrod.subtitle')}
      />
      <HookFormPasswordInput
        label={t('signUp.passwordLabel')}
        accessibilityLabel={t('signUp.passwordAccessibilityLabel')}
        name={ResetPasswordFields.password}
        password={password}
        control={control}
        error={errors[ResetPasswordFields.password]}
        onSubmitEditing={handleOnSubmit}
        passwordConfirmationField={{
          label: t('signUp.passwordConfirmationLabel'),
          accessibilityLabel: t(
            'signUp.passwordConfirmationAccessibilityLabel',
          ),
          name: ResetPasswordFields.passwordConfirmation,
          error: errors[ResetPasswordFields.passwordConfirmation],
        }}
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}>
        <View style={styles.footerButton}>
          <CTA
            text={t(`resetPassword.submitButton`)}
            accessibilityLabel={t(
              `resetPassword.submitButtonAccessibilityLabel`,
            )}
            onPress={handleOnSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  footerButton: {
    marginBottom: 12,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'stretch',
  },
});

export default ResetPasswordForm;
