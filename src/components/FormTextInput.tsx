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
  TouchableOpacity,
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
  type KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { useInputTheme } from '@/styles/useInputTheme';

interface FormTextInputProps {
  label: string;
  forgotPasswordLabel?: string;
  forgotPasswordCallback?: () => void;
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
  forgotPasswordLabel,
  forgotPasswordCallback,
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
      {forgotPasswordLabel && (
        <View style={styles.inputLabelContainer}>
          <TouchableOpacity onPress={forgotPasswordCallback}>
            <Text style={[styles.forgotPassword, dynamicStyles.forgot]}>
              {forgotPasswordLabel}
            </Text>
          </TouchableOpacity>
        </View>
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
  inputLabelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 8,
    paddingHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    height: 48,
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
  forgotPassword: {
    fontWeight: '700',
  },
});
