import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';

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
}: HookFormTextInputProps<TFormSchema>) => {
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
              secureTextEntry={secureTextEntry}
            />
          </>
        );
      }}
    />
  );
};
