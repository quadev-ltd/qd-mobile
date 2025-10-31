import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';
import { type KeyboardTypeOptions } from 'react-native';

import { FormTextInput } from '../FormTextInput';

import { type FieldType } from './types';

interface HookFormTextInputProps<
  TFormSchema extends Record<FieldType, string>,
> {
  name: keyof TFormSchema;
  label: string;
  accessibilityLabel: string;
  control?: Control<TFormSchema>;
  secureTextEntry?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  onSubmitEditing?: () => void;
  keyboardType?: KeyboardTypeOptions;
}

export const HookFormTextInput = <
  TFormSchema extends Record<FieldType, string>,
>({
  name,
  label,
  accessibilityLabel,
  control,
  secureTextEntry,
  error,
  onSubmitEditing,
  keyboardType,
  ...rest
}: HookFormTextInputProps<TFormSchema>) => {
  return (
    <Controller
      name={name as FieldType}
      control={control}
      render={({ field: { onChange, onBlur, value, ref } }) => {
        return (
          <>
            <FormTextInput
              label={label}
              accessibilityLabel={accessibilityLabel}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={error}
              secureTextEntry={secureTextEntry}
              onSubmitEditing={onSubmitEditing}
              keyboardType={keyboardType}
              ref={ref}
              {...rest}
            />
          </>
        );
      }}
    />
  );
};
