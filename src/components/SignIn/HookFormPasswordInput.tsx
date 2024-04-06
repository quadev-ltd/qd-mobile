import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type FieldValues,
  type Merge,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text } from 'react-native';

import {
  usePasswordValidation,
  type PasswordValidityAttributes,
} from '../../hooks/usePasswordValidation';
import { FormTextInput } from '../FormTextInput';

import { colors } from '@/styles/common';

interface HookFormPasswordInputProps {
  name: string;
  control: Control<FieldValues>;
  password?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}

export const HookFormPasswordInput: React.FC<HookFormPasswordInputProps> = ({
  name,
  password,
  control,
  error,
}) => {
  const { t } = useTranslation();
  const validations: PasswordValidityAttributes =
    usePasswordValidation(password);
  const passwordHints = Object.keys(validations)
    .filter(key => !validations[key] && key !== 'isValid')
    .map(key => {
      switch (key) {
        case 'hasUpperCase':
          return t('signUp.passwordUppercaseError');
        case 'hasLowerCase':
          return t('signUp.passwordLowercaseError');
        case 'hasNumber':
          return t('signUp.passwordNumberError');
        case 'hasSpecialChar':
          return t('signUp.passwordSpecialCharacterError');
        case 'hasLength':
          return t('signUp.passwordLengthError');
        default:
          break;
      }
    });
  const { isValid } = validations;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <>
            <FormTextInput
              label={t('signUp.passwordLabel')}
              accessibilityLabel={t('signUp.passwordAccessibilityLabel')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={error}
              secureTextEntry={true}
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
