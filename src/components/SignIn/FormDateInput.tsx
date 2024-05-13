import {
  type FieldError,
  type FieldErrorsImpl,
  type Merge,
} from 'react-hook-form';
import {
  View,
  StyleSheet,
  Text,
  type TextInputFocusEventData,
  type NativeSyntheticEvent,
} from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import { useTheme } from 'react-native-paper';

import { useInputTheme } from '@/styles/useInputTheme';

interface FormDateInputProps {
  label: string;
  forgotPasswordLabel?: string;
  forgotPasswordCallback?: () => void;
  accessibilityLabel: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
  onSubmitEditing?: () => void;
}

export const FormDateInput: React.FC<FormDateInputProps> = ({
  label,
  accessibilityLabel,
  onBlur,
  onChangeText,
  value,
  error,
  onSubmitEditing,
}) => {
  const { colors } = useTheme();
  const dynamicStyles = useInputTheme();
  return (
    <View style={styles.fieldConatiner}>
      <MaskInput
        testID={label}
        style={[styles.input, dynamicStyles.input]}
        placeholder={label}
        placeholderTextColor={colors.onTertiary}
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={onChangeText}
        mask={Masks.DATE_DDMMYYYY}
        onBlur={onBlur}
        keyboardType="numeric"
        onSubmitEditing={onSubmitEditing}
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
    height: 48,
    borderRadius: 25,
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
