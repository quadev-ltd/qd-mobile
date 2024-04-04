import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { colors } from '@/styles/common';

interface FormTextInputProps {
  label: string;
  forgotPasswordLabel?: string;
  forgotPasswordCallback?: () => void;
  accessibilityLabel: string;
  secureTextEntry?: boolean;
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  label,
  forgotPasswordLabel,
  forgotPasswordCallback,
  accessibilityLabel,
  secureTextEntry,
}) => {
  return (
    <View style={styles.fieldConatiner}>
      <TextInput
        style={styles.input}
        secureTextEntry={secureTextEntry}
        placeholder={label}
        accessible
        accessibilityLabel={accessibilityLabel}
      />
      {forgotPasswordLabel && (
        <View style={styles.inputLabelContainer}>
          <TouchableOpacity onPress={forgotPasswordCallback}>
            <Text style={styles.forgotPassword}>{forgotPasswordLabel}</Text>
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
  forgotPassword: {
    fontWeight: '700',
  },
});
