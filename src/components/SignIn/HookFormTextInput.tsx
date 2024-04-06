import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type FieldValues,
  type Merge,
} from 'react-hook-form';

import { FormTextInput } from '../FormTextInput';

interface HookFormTextInputProps {
  name: string;
  label: string;
  accessibilityLabel: string;
  control?: Control<FieldValues>;
  secureTextEntry?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}

export const HookFormTextInput: React.FC<HookFormTextInputProps> = ({
  name,
  label,
  accessibilityLabel,
  control,
  secureTextEntry,
  error,
}) => {
  return (
    <Controller
      name={name}
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
