import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Keyboard } from 'react-native';

import CTA from '@/components/CTA';
import { HookFormPasswordInput } from '@/components/SignIn/HookFormPasswordInput';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import Spinner from '@/components/Spinner';
import { useLoadUserProfile } from '@/core/api/hooks/useLoadUserProfile';
import { useSignIn } from '@/core/api/hooks/useSignIn';
import { useAppSelector } from '@/core/state/hooks';
import { SignInFields, type SignInSchemaType } from '@/schemas/signInSchema';

interface SignInFormProps {
  forgotPasswordCallback: (email?: string) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  forgotPasswordCallback,
}) => {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    reset,
  } = useFormContext<SignInSchemaType>();
  const { t } = useTranslation();
  const { signIn, isLoading, isSuccess } = useSignIn(setError);
  const authToken = useAppSelector(state => state.auth.authToken);
  useLoadUserProfile(authToken, reset);
  const password = watch(SignInFields.password);
  const email = watch(SignInFields.email);

  const handleOnSubmit = () => {
    Keyboard.dismiss();
    handleSubmit(signIn)();
  };

  if (isLoading || isSuccess) {
    return <Spinner />;
  }

  const handleForgotPasswordNavigation = () => {
    if (errors[SignInFields.email]) {
      forgotPasswordCallback(email);
    } else forgotPasswordCallback();
  };

  return (
    <>
      <HookFormTextInput
        label={t('signIn.emailLabel')}
        accessibilityLabel={t('signIn.emailAccessibilityLabel')}
        name={SignInFields.email}
        control={control}
        error={errors[SignInFields.email]}
        onSubmitEditing={handleOnSubmit}
        keyboardType="email-address"
      />
      <HookFormPasswordInput
        label={t('signIn.passwordLabel')}
        accessibilityLabel={t('signIn.passwordAccessibilityLabel')}
        forgotPasswordLabel={t('signIn.forgotButton')}
        forgotPasswordCallback={handleForgotPasswordNavigation}
        name={SignInFields.password}
        password={password}
        control={control}
        error={errors[SignInFields.password]}
        onSubmitEditing={handleOnSubmit}
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
