import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useSignInWithFirebaseMutation } from '../api';
import {
  asynchErrorMessages,
  processError,
  type RTKQueryErrorType,
} from '../api/errors';
import { useLoadUserProfile } from '../api/hooks/useLoadUserProfile';
import { type ResponseError } from '../api/types';
import logger from '../logger';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { login } from '../state/slices/authSlice';

import { onAppleSignIn } from './appleSSO';
import { type FirebaseProfileData } from './types';

import CTA from '@/components/CTA';
import { MaterialIcon } from '@/components/MaterialIcon';
import { type ScreenType } from '@/components/SignIn/types';
import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';

interface AppleSSOCTAProps {
  hide: boolean;
  disableAnimation: boolean;
  screen: ScreenType;
  setIsLoading: (isLoading: boolean) => void;
}

const AppleSSOCTA: React.FC<AppleSSOCTAProps> = ({
  hide,
  disableAnimation,
  screen,
  setIsLoading,
}) => {
  const [signInWithFirebase] = useSignInWithFirebaseMutation();
  const authToken = useAppSelector(state => state.auth.authToken);
  useLoadUserProfile(authToken);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleError = (error: Error) => {
    processError(error as RTKQueryErrorType, t, {
      onUnmanagedError: message => {
        showErrorToast(t('error.errorTitle'), message);
      },
      onUnexpectedError: () => showUnexpectedErrorToast(t),
      logErrorMessage: `Unknown error while signing in with Apple: ${JSON.stringify(
        error,
      )}`,
    });
  };
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    let appleSSOData: FirebaseProfileData | undefined;
    try {
      appleSSOData = await onAppleSignIn();
    } catch (error) {
      handleError(error as Error);
      setIsLoading(false);
      return;
    }
    try {
      if (appleSSOData) {
        const response = await signInWithFirebase(appleSSOData).unwrap();
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
        showErrorToast(t('error.errorTitle'), t('error.appleSSODataError'));
        console.error(`Validation error`, error);
        console.error(
          `Validation errors for ${appleSSOData?.email}:\n ${errors.join(
            '\n',
          )}`,
        );
        logger().logError(
          new Error(
            `Validation errors for ${appleSSOData?.email}:\n ${errors.join(
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
      testID="facebook-cta"
      Icon={
        <MaterialIcon
          style={styles.appleIcon}
          name="apple"
          size={36}
          color={colors.onPrimary}
        />
      }
      text={t(`${screen}.withApple`)}
      accessibilityLabel={t(`${screen}.withAppleAccessibilityLabel`)}
      style={[styles.appleButton, { backgroundColor: colors.primary }]}
      onPress={handleAppleSignIn}
      hide={hide}
      disableAnimation={disableAnimation}
    />
  );
};

const styles = StyleSheet.create({
  appleButton: {
    marginBottom: 20,
  },
  appleIcon: {
    position: 'absolute',
    left: 16,
  },
});

export default AppleSSOCTA;
