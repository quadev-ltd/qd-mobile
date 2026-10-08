import {
  type Control,
  Controller,
  type FieldError,
  type FieldErrorsImpl,
  type FieldValues,
  type Merge,
  type Path,
} from 'react-hook-form';
import { type ViewStyle, type KeyboardTypeOptions } from 'react-native';

import { FormTextInput } from '../FormTextInput';

interface HookFormTextInputProps<TFormSchema extends FieldValues> {
  name: keyof TFormSchema;
  label: string;
  accessibilityLabel: string;
  control?: Control<TFormSchema>;
  secureTextEntry?: boolean;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  onSubmitEditing?: () => void;
  keyboardType?: KeyboardTypeOptions;
  style?: ViewStyle;
  numberOfLines?: number;
  multiline?: boolean;
  containerStyle?: ViewStyle;
  textAlignVertical?: 'top' | 'center' | 'bottom';
}

export const HookFormTextInput = <TFormSchema extends FieldValues>({
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
      name={name as Path<TFormSchema>}
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
