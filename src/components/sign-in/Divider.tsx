import { View, StyleSheet, Text } from 'react-native';

import { colors } from '@/styles/common';

type DividerProps = {
  label: string;
};

export const Divider: React.FC<DividerProps> = ({ label }) => {
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.divider} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  divider: {
    borderColor: colors.black,
    borderWidth: 0.5,
    flexGrow: 1,
    height: 1,
    margin: 0,
  },
  dividerText: {
    fontWeight: '700',
  },
});
