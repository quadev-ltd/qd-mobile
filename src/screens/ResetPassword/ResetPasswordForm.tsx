import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Platform } from 'react-native';

import ResetPasswordStatus from './ResetPasswordStatus';

import { CTA } from '@/components/CTA';
import { HookFormPasswordInput } from '@/components/SignIn/HookFormPasswordInput';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import Subtitle from '@/components/SignIn/Subtitle';
import { useResetPassword } from '@/core/api/hooks/useResetPassword';
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

const DELAY = 4000;

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

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  useEffect(() => {
    if (isResetSuccess) {
      timeoutRef.current = setTimeout(() => {
        onSuccessGoToSignIn();
      }, DELAY);
    }
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [isResetSuccess, onSuccessGoToSignIn]);
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
    <>
      <Subtitle
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
      />
      <HookFormTextInput
        label={t('signUp.passwordConfirmationLabel')}
        accessibilityLabel={t('signUp.passwordConfirmationAccessibilityLabel')}
        name={ResetPasswordFields.passwordConfirmation}
        control={control}
        error={errors[ResetPasswordFields.passwordConfirmation]}
        onSubmitEditing={handleOnSubmit}
        keyboardType={Platform.OS === 'ios' ? 'visible-password' : 'default'}
        secureTextEntry={true}
      />

      <View style={styles.footerButton}>
        <CTA
          text={t(`resetPassword.submitButton`)}
          accessibilityLabel={t(`resetPassword.submitButtonAccessibilityLabel`)}
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

export default ResetPasswordForm;
