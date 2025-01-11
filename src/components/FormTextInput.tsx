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
  type KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useInputTheme } from '@/styles/useInputTheme';

interface FormTextInputProps {
  label: string;
  accessibilityLabel: string;
  secureTextEntry?: boolean;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (text: string) => void;
  onSubmitEditing?: () => void;
  value?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  keyboardType?: KeyboardTypeOptions;
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  label,
  accessibilityLabel,
  secureTextEntry,
  onSubmitEditing,
  onBlur,
  onChangeText,
  keyboardType,
  value,
  error,
}) => {
  const { colors } = useTheme();
  const dynamicStyles = useInputTheme();
  return (
    <View style={styles.fieldConatiner}>
      <TextInput
        testID={label}
        style={[styles.input, dynamicStyles.input]}
        secureTextEntry={secureTextEntry}
        placeholder={label}
        placeholderTextColor={colors.onTertiary}
        accessible
        accessibilityLabel={accessibilityLabel}
        onBlur={onBlur}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="go"
        keyboardType={keyboardType}
        value={value}
      />
      {error && (
        <Text style={[styles.error, dynamicStyles.error]}>
          {error.message as string}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldConatiner: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'stretch',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    height: 44,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  error: {
    position: 'absolute',
    bottom: 0,
    left: 16,
  },
});
