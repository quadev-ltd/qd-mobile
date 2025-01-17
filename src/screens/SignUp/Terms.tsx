import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { env } from '@/core/env';

export const Terms: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      tAndCText: {
        color: theme.colors.primary,
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
        <Text
          style={styles.termsLink}
          onPress={() =>
            Linking.openURL(
              `https://${env.DEEP_LINKING_DOMAIN}/terms-and-conditions`,
            )
          }>
          {t('signUp.termsOfService')}
        </Text>
        &
        <Text
          style={styles.termsLink}
          onPress={() =>
            Linking.openURL(`https://${env.DEEP_LINKING_DOMAIN}/privacy-policy`)
          }>
          {t('signUp.privacyPolicy')}
        </Text>
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
    fontWeight: 'bold',
  },
});
