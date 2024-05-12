import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, Platform } from 'react-native';

import {
  usePasswordValidation,
  type PasswordValidityAttributes,
} from '../../hooks/usePasswordValidation';
import { FormTextInput } from '../FormTextInput';

import { type FieldType } from './types';

import { colors } from '@/styles/colors';

interface HookFormPasswordInputProps<
  TFormSchema extends Record<FieldType, string>,
> {
  label: string;
  accessibilityLabel: string;
  name: keyof TFormSchema;
  control: Control<TFormSchema>;
  password?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  forgotPasswordLabel?: string;
  forgotPasswordCallback?: () => void;
  onSubmitEditing?: () => void;
}

export const HookFormPasswordInput = <
  TFormSchema extends Record<FieldType, string>,
>({
  label,
  accessibilityLabel,
  name,
  password,
  control,
  error,
  forgotPasswordLabel,
  forgotPasswordCallback,
  onSubmitEditing,
}: HookFormPasswordInputProps<TFormSchema>) => {
  const { t } = useTranslation();
  const validations: PasswordValidityAttributes =
    usePasswordValidation(password);
  const passwordHints = Object.keys(validations)
    .filter(key => !validations[key] && key !== 'isValid')
    .map(key => {
      switch (key) {
        case 'hasUpperCase':
          return t('fieldError.passwordUppercaseError');
        case 'hasLowerCase':
          return t('fieldError.passwordLowercaseError');
        case 'hasNumber':
          return t('fieldError.passwordNumberError');
        case 'hasSpecialChar':
          return t('fieldError.passwordSpecialCharacterError');
        case 'hasLength':
          return t('fieldError.passwordLengthError');
        default:
          break;
      }
    });
  const { isValid } = validations;
  return (
    <Controller
      name={name as FieldType}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <>
            <FormTextInput
              label={label}
              accessibilityLabel={accessibilityLabel}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={error}
              secureTextEntry={true}
              forgotPasswordLabel={forgotPasswordLabel}
              forgotPasswordCallback={forgotPasswordCallback}
              onSubmitEditing={onSubmitEditing}
              keyboardType={
                Platform.OS !== 'ios' ? 'default' : 'visible-password'
              }
            />
            {!isValid && (
              <View style={styles.passwordHintsContainer}>
                {passwordHints.map(hint => (
                  <Text key={hint} style={styles.passwordHints}>
                    {hint}
                  </Text>
                ))}
              </View>
            )}
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  passwordHintsContainer: {
    marginTop: -4,
    marginBottom: 12,
    alignContent: 'center',
  },
  passwordHints: {
    color: colors.white,
    fontSize: 12,
    marginHorizontal: 24,
    marginBottom: 8,
  },
});
