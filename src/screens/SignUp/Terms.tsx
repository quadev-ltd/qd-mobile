import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const handleTsAndCs = () =>
    Linking.openURL(`https://${env.DEEP_LINKING_DOMAIN}/terms-and-conditions`);
  const handlePrivacyPolicy = () =>
    Linking.openURL(`https://${env.DEEP_LINKING_DOMAIN}/privacy-policy`);
  return (
    <View style={styles.tAndCContainer}>
      <Text style={[styles.tAndCText, dynamicStyles.tAndCText]}>
        {t('signUp.termsLabel')}{' '}
        <TouchableOpacity onPress={handleTsAndCs}>
          <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
            {t('signUp.termsOfService')}
          </Text>
        </TouchableOpacity>{' '}
        &{' '}
        <TouchableOpacity onPress={handlePrivacyPolicy}>
          <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
            {t('signUp.privacyPolicy')}
          </Text>
        </TouchableOpacity>
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
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
