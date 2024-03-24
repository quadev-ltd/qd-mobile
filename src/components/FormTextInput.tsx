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
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
  label,
  forgotPasswordLabel,
  forgotPasswordCallback,
  accessibilityLabel,
}) => {
  return (
    <View style={styles.fieldConatiner}>
      <TextInput
        style={styles.input}
        secureTextEntry={true}
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
  },
  forgotPassword: {
    fontWeight: '700',
  },
});
