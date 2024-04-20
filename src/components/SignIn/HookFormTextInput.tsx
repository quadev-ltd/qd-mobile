import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';

import { FormTextInput } from '../FormTextInput';

import { type SignUpSchemaType } from '@/schemas/signUpSchema';

interface HookFormTextInputProps {
  name: keyof SignUpSchemaType;
  label: string;
  accessibilityLabel: string;
  control?: Control<SignUpSchemaType>;
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
