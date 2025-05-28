import { forwardRef } from 'react';
import {
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
  type ViewStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useInputDynamicStyles } from '@/styles/useInputDynamicStyles';

interface FormTextAreaInputProps {
  label: string;
  accessibilityLabel: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  value?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  containerStyle?: ViewStyle;
  numberOfLines?: number;
  height?: number;
  style?: ViewStyle;
}

export const FormTextAreaInput = forwardRef<TextInput, FormTextAreaInputProps>(
  (
    {
      containerStyle,
      style,
      label,
      accessibilityLabel,
      onSubmitEditing,
      onBlur,
      onChangeText,
      value,
      error,
      numberOfLines = 5,
      ...textInputProps
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const dynamicStyles = useInputDynamicStyles();
    return (
      <View style={[styles.fieldContainer, containerStyle]}>
        <TextInput
          testID={label}
          style={[styles.input, dynamicStyles.input, styles.textArea, style]}
          placeholder={label}
          placeholderTextColor={colors.onTertiary}
          accessible
          accessibilityLabel={accessibilityLabel}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="default"
          multiline
          numberOfLines={numberOfLines}
          value={value}
          ref={ref}
          textAlignVertical="top"
          {...textInputProps}
        />
        {error && (
          <Text style={[styles.error, dynamicStyles.error]}>
            {error.message as string}
          </Text>
        )}
      </View>
    );
  },
);

FormTextAreaInput.displayName = 'FormTextAreaInput';

const styles = StyleSheet.create({
  fieldContainer: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'stretch',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  textArea: {
    borderRadius: 20,
    height: '100%',
  },
  error: {
    position: 'absolute',
    bottom: 0,
    left: 16,
  },
});
