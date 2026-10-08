import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type FieldValues,
  type Merge,
  type Path,
} from 'react-hook-form';

import { FormDateInput } from './FormDateInput';

interface HookFormDateInputProps<TFormSchema extends FieldValues> {
  name: Path<TFormSchema>;
  label: string;
  accessibilityLabel: string;
  control?: Control<TFormSchema>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  onSubmitEditing?: () => void;
}

export const HookFormDateInput = <TFormSchema extends FieldValues>({
  name,
  label,
  accessibilityLabel,
  control,
  error,
  onSubmitEditing,
}: HookFormDateInputProps<TFormSchema>) => {
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
