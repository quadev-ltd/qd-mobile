import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export const Terms: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      tAndCText: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bodyLarge.fontFamily,
        fontSize: theme.fonts.bodyLarge.fontSize,
      },
    }),
    [theme],
  );
  return (
    <View style={styles.tAndCContainer}>
      <Text style={[styles.tAndCText, dynamicStyles.tAndCText]}>
        {t('signUp.termsLabel')}
        <Text style={styles.termsLink}>{t('signUp.termsOfService')}</Text>&
        <Text style={styles.termsLink}>{t('signUp.privacyPolicy')}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tAndCContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tAndCText: {
    flex: 1,
    alignSelf: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});
