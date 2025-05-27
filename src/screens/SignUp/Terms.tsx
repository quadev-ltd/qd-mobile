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
import { useDynamicStyles } from '@/styles/useDynamicStyles';

export const Terms: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dynamicStyles = useDynamicStyles();
  const handleTsAndCs = () =>
    Linking.openURL(`https://${env.DEEP_LINKING_DOMAIN}/terms-and-conditions`);
  const handlePrivacyPolicy = () =>
    Linking.openURL(`https://${env.DEEP_LINKING_DOMAIN}/privacy-policy`);
  return (
    <View style={styles.tAndCContainer}>
      <Text style={[styles.tAndCText, dynamicStyles.textCTAText]}>
        {t('signUp.termsLabel')}{' '}
        <TouchableOpacity onPress={handleTsAndCs}>
          <Text style={[styles.termsLink, { color: theme.colors.secondary }]}>
            {t('signUp.termsOfService')}
          </Text>
        </TouchableOpacity>{' '}
        &{' '}
        <TouchableOpacity onPress={handlePrivacyPolicy}>
          <Text style={[styles.termsLink, { color: theme.colors.secondary }]}>
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
