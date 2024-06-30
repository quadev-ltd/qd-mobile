import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useSignInWithFirebaseMutation } from '../api';
import { asynchErrorMessages, processUnmanagedError } from '../api/errors';
import { useLoadUserProfile } from '../api/hooks/useLoadUserProfile';
import { type ResponseError } from '../api/types';
import logger from '../logger';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { login } from '../state/slices/authSlice';

import { type GoogleProfileData, onGoogleSignIn } from './googleSSO';

import CTA from '@/components/CTA';
import { type ScreenType } from '@/components/SignIn/types';
import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import { colors } from '@/styles/colors';

interface GoogleSSOCTAProps {
  hide: boolean;
  disableAnimation: boolean;
  screen: ScreenType;
  setIsLoading: (isLoading: boolean) => void;
}

const GoogleSSOCTA: React.FC<GoogleSSOCTAProps> = ({
  hide,
  disableAnimation,
  screen,
  setIsLoading,
}) => {
  const [signInWithFirebase] = useSignInWithFirebaseMutation();
  const authToken = useAppSelector(state => state.auth.authToken);
  useLoadUserProfile(authToken);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleError = (error: Error) => {
    const errorMessage = processUnmanagedError(error as Error, t);
    if (errorMessage) {
      showErrorToast(t('error.errorTitle'), errorMessage);
    } else {
      logger().logError(error as Error);
      showUnexpectedErrorToast(t);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    let googleSSOData: GoogleProfileData | undefined;
    try {
      googleSSOData = await onGoogleSignIn();
    } catch (error) {
      handleError(error as Error);
      setIsLoading(false);
      return;
    }
    try {
      if (googleSSOData) {
        const response = await signInWithFirebase(googleSSOData).unwrap();
        dispatch(login(response));
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      const typedError = error as ResponseError;
      if (
        typedError.data?.field_errors &&
        typedError.data.field_errors.length > 0 &&
        typedError.status === 400
      ) {
        const errors: string[] = [];
        typedError.data?.field_errors?.forEach(fieldError => {
          const errorMessage = asynchErrorMessages(t, fieldError.error);
          if (!errorMessage) {
            logger().logError(
              Error(`Unknown field error: ${JSON.stringify(error)}`),
            );
            return;
          }
          errors.push(`${fieldError.field}: ${errorMessage}`);
        });
        showErrorToast(t('error.errorTitle'), t('error.googleSSODataError'));
        logger().logError(
          new Error(
            `Validation errors for ${googleSSOData?.email}:\n ${errors.join(
              '\n',
            )}`,
          ),
        );
      } else {
        handleError(error as Error);
      }
      setIsLoading(false);
    }
  };
  return (
    <CTA
      isAnimated={true}
      testID="google-cta"
      Icon={<Icon name="google" size={28} color={colors.grey} />}
      text={t(`${screen}.withGoogle`)}
      accessibilityLabel={t(`${screen}.withGoogleAccessibilityLabel`)}
      style={styles.googleButton}
      textStyle={{ color: colors.grey }}
      onPress={handleGoogleSignIn}
      hide={hide}
      disableAnimation={disableAnimation}
    />
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: colors.white,
    marginBottom: 20,
  },
});

export default GoogleSSOCTA;
