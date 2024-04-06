import { zodResolver } from '@hookform/resolvers/zod';
import { type FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Keyboard } from 'react-native';

import { CTA } from '@/components/CTA';
import { commonStyles } from '@/components/SignIn/constants';
import { HookFormDateInput } from '@/components/SignIn/HookFormDateInput';
import { HookFormPasswordInput } from '@/components/SignIn/HookFormPasswordInput';
import { HookFormTextInput } from '@/components/SignIn/HookFormTextInput';
import { SignUpFields, signUpSchema } from '@/schemas/signUpSchema';

interface SignUpFormScreenProps {}

export const SignUpForm: React.FC<SignUpFormScreenProps> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: zodResolver(signUpSchema) });
  const { t } = useTranslation();
  const password = watch('password');

  const onSubmit = (data: FieldValues) => {
    // Reset form on submit
    // eslint-disable-next-line no-console
    console.log('Data:::', data);
  };
  const handleOnSubmit = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

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
