import { useState } from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import {
  usePasswordValidation,
  type PasswordValidityAttributes,
} from '../../hooks/usePasswordValidation';
import { FormTextInput } from '../FormTextInput';
import { MaterialIcon } from '../MaterialIcon';

import { HookFormTextInput } from './HookFormTextInput';
import { type FieldType } from './types';

import { colors } from '@/styles/colors';
import { useInputTheme } from '@/styles/useInputTheme';

interface PasswordConfirmationProps<
  TFormSchema extends Record<FieldType, string>,
> {
  label: string;
  accessibilityLabel: string;
  name: keyof TFormSchema;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}

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
  passwordConfirmationField?: PasswordConfirmationProps<TFormSchema>;
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
  passwordConfirmationField,
}: HookFormPasswordInputProps<TFormSchema>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const dynamicStyles = useInputTheme();
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
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <>
      <Controller
        name={name as FieldType}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <>
              <View style={styles.inputContainer}>
                <FormTextInput
                  containerStyle={styles.textInputContainer}
                  label={label}
                  accessibilityLabel={accessibilityLabel}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={error}
                  secureTextEntry={!isPasswordVisible}
                  onSubmitEditing={onSubmitEditing}
                  keyboardType="default"
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={togglePasswordVisibility}
                  accessibilityLabel={
                    isPasswordVisible
                      ? t('password.hideAccessibilityLabel')
                      : t('password.showAccessibilityLabel')
                  }>
                  <MaterialIcon
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {forgotPasswordLabel && (
                <View style={styles.inputLabelContainer}>
                  <TouchableOpacity onPress={forgotPasswordCallback}>
                    <Text style={[styles.forgotPassword, dynamicStyles.forgot]}>
                      {forgotPasswordLabel}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
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
      {passwordConfirmationField && (
        <HookFormTextInput
          label={passwordConfirmationField.label}
          accessibilityLabel={passwordConfirmationField.accessibilityLabel}
          name={passwordConfirmationField.name}
          control={control}
          error={passwordConfirmationField.error}
          onSubmitEditing={onSubmitEditing}
          keyboardType="default"
          secureTextEntry={!isPasswordVisible}
        />
      )}
    </>
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
  textInputContainer: {
    marginBottom: 0,
  },
  inputLabelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
    paddingHorizontal: 5,
    height: 24,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
  },
  forgotPassword: {
    fontWeight: '700',
  },
});
