import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { type Screen, type StackParamList } from '../Routing/types';

import FlatTextCTA from '@/components/FlatTextCTA';
import { Layout } from '@/components/SignIn/Layout';
import { useResendVerificationEmailMutation } from '@/core/api';
import { colors } from '@/styles';

export type WelcomeScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.Wellcome
>;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  route: { params },
}) => {
  const { t } = useTranslation();
  const [resendVerificationEmail, { isLoading, isSuccess }] =
    useResendVerificationEmailMutation();
  const resendEmail = () => {
    resendVerificationEmail({ userID: params.userID });
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.titleConatiner} />
        {isLoading ? (
          <Image
            style={styles.titleImage}
            source={require('../../assets/gif/sending.gif')}
          />
        ) : isSuccess ? (
          <Image
            style={styles.titleImageSending}
            source={require('../../assets/gif/check.gif')}
          />
        ) : (
          <Image
            style={styles.titleImage}
            source={require('../../assets/gif/mail.gif')}
          />
        )}
        <Text
          style={styles.welcomeText}
          accessibilityHint={`${t('wellcome.title')} ${
            params.applicationName
          } ${params.firstName}`}>
          {t('wellcome.title')} {params.applicationName} {params.firstName}!
        </Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.emailVerificationText}>
            {t('wellcome.emailVerification')}
          </Text>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              animating={true}
              color={colors.black}
            />
          ) : (
            <FlatTextCTA
              style={styles.resend}
              text={t('wellcome.resendCTA')}
              accessibilityLabel={t('wellcome.resendCTAAccessibilityLabel')}
              onPress={resendEmail}
            />
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  titleConatiner: {
    flex: 1,
    position: 'relative',
  },
  titleImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 0,
  },
  titleImageSending: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    marginBottom: 40,
  },
  descriptionContainer: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  emailVerificationText: {
    fontSize: 16,
    paddingHorizontal: 0,
    paddingBottom: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.white,
    lineHeight: 24,
  },
  resend: {
    fontSize: 16,
  },
});

export default WelcomeScreen;
