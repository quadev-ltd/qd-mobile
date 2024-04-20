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

import { colors } from '@/styles';

interface FormDateInputProps {
  label: string;
  forgotPasswordLabel?: string;
  forgotPasswordCallback?: () => void;
  accessibilityLabel: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChangeText?: (text: string) => void;
  value?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl>;
}

export const FormDateInput: React.FC<FormDateInputProps> = ({
  label,
  accessibilityLabel,
  onBlur,
  onChangeText,
  value,
  error,
}) => {
  return (
    <View style={styles.fieldConatiner}>
      <MaskInput
        testID={label}
        style={styles.input}
        placeholder={label}
        accessibilityLabel={accessibilityLabel}
        value={value}
        onChangeText={onChangeText}
        mask={Masks.DATE_DDMMYYYY}
        onBlur={onBlur}
        keyboardType="numeric"
      />
      {error && <Text style={styles.error}>{error.message as string}</Text>}
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: colors.black,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
  },
  error: {
    color: colors.red,
    fontSize: 12,
    position: 'absolute',
    top: 26,
    left: 16,
  },
});
