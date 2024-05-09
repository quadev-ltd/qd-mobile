import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

import ForgotPasswordStatus from './ForgotPasswordStatus';

import CTA from '@/components/CTA';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import Subtitle from '@/components/SignIn/Subtitle';
import { useForgotPassword } from '@/core/api/hooks/useForgotPassword';
import {
  ForgotPasswordFields,
  type ForgotPasswordSchemaType,
  forgotPasswordSchema,
} from '@/schemas/forgotPasswordSchema';
import { SignInFields } from '@/schemas/signInSchema';

export interface ForgotPasswordFormProps {
  emailLabel: string;
  emailAccessibilityLabel: string;
  defaultEmail: string;
  submitLabel: string;
  submitAccessibilityLabel: string;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  emailLabel,
  emailAccessibilityLabel,
  defaultEmail,
  submitLabel,
  submitAccessibilityLabel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      [ForgotPasswordFields.email]: defaultEmail,
    },
  });
  const { t } = useTranslation();
  const {
    showStatus,
    setShowStatus,
    forgotPassword,
    isLoading,
    isError,
    isSuccess,
    errorMessage,
  } = useForgotPassword();

  const handleOnSubmit = handleSubmit(forgotPassword);

  const showPasswordResetFrom = () => setShowStatus(false);

  if (showStatus) {
    return (
      <ForgotPasswordStatus
        hideStatus={showPasswordResetFrom}
        isError={isError}
        isLoading={isLoading}
        isSuccess={isSuccess}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Subtitle
        text={t('forgotPassword.subtitle')}
        accessibilityLabel={t('forgotPassword.subtitle')}
      />
      <HookFormTextInput
        label={emailLabel}
        accessibilityLabel={emailAccessibilityLabel}
        name={ForgotPasswordFields.email}
        control={control}
        error={errors[SignInFields.email]}
        onSubmitEditing={handleOnSubmit}
        keyboardType="email-address"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 200 : 0}>
        <View style={styles.footerButton}>
          <CTA
            text={submitLabel}
            accessibilityLabel={submitAccessibilityLabel}
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

export default ForgotPasswordForm;
