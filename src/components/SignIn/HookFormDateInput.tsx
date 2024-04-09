import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type FieldValues,
  type Merge,
} from 'react-hook-form';

import { FormDateInput } from './FormDateInput';
import { SignUpSchemaType } from '@/schemas/signUpSchema';

interface HookFormDateInputProps {
  name: keyof SignUpSchemaType;
  label: string;
  accessibilityLabel: string;
  control?: Control<SignUpSchemaType>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}

export const HookFormDateInput: React.FC<HookFormDateInputProps> = ({
  name,
  label,
  accessibilityLabel,
  control,
  error,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <>
            <FormDateInput
              label={label}
              accessibilityLabel={accessibilityLabel}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={error}
            />
          </>
        );
      }}
    />
  );
};
