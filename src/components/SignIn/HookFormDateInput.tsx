import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';

import { FormDateInput } from './FormDateInput';

import { type SignUpSchemaType } from '@/schemas/signUpSchema';

interface HookFormDateInputProps {
  name: keyof SignUpSchemaType;
  label: string;
  accessibilityLabel: string;
  control?: Control<SignUpSchemaType>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  onSubmitEditing?: () => void;
}

export const HookFormDateInput: React.FC<HookFormDateInputProps> = ({
  name,
  label,
  accessibilityLabel,
  control,
  error,
  onSubmitEditing,
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
              onSubmitEditing={onSubmitEditing}
            />
          </>
        );
      }}
    />
  );
};
