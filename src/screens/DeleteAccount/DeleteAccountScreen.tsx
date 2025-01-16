import { type DrawerScreenProps } from '@react-navigation/drawer';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import CTA from '@/components/CTA';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import Spinner from '@/components/Spinner';
import { showInfoToast } from '@/components/Toast';
import { useDeleteAccount } from '@/core/api/hooks/useDeleteAccount';
import { useAppDispatch } from '@/core/state/hooks';
import { logout } from '@/core/state/slices/authSlice';
import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';

export type ScreenTwoScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.DeleteAccount
>;

const ScreenTwoScreen: React.FC<ScreenTwoScreenProps> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { fonts, colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      title: {
        color: colors.primary,
        fontFamily: fonts.titleLarge.fontFamily,
        fontSize: fonts.titleLarge.fontSize,
      },
      description: {
        color: colors.primary,
        fontFamily: fonts.bodyLarge.fontFamily,
        fontSize: fonts.bodyLarge.fontSize,
      },
    }),
    [fonts, colors],
  );
  const { isLoading, handleDeleteAccount, errorMessage, isSuccess } =
    useDeleteAccount();
  useEffect(() => {
    const handleLogout = () => dispatch(logout());
    if (isSuccess) {
      handleLogout();
      showInfoToast(
        t('deleteAccount.successTitle'),
        t('deleteAccount.successMessage'),
      );
    }
  }, [t, dispatch, isSuccess]);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <Spinner />
          <Text style={[styles.description, dynamicStyles.description]}>
            {t('deleteAccount.deleting')}
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.title, dynamicStyles.title]}>
            {t('deleteAccount.title')}
          </Text>
          <Text style={[styles.description, dynamicStyles.description]}>
            {t('deleteAccount.description')}
          </Text>
          {errorMessage && (
            <ErrorMessage
              text={errorMessage}
              accessibilityLabel={errorMessage}
            />
          )}
          <View style={styles.buttonContainer}>
            <CTA
              text={t('deleteAccount.deleteButton')}
              accessibilityLabel={t(
                'deleteAccount.deleteButtonAccessibilityLabel',
              )}
              onPress={handleDeleteAccount}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 24,
  },
});

export default ScreenTwoScreen;
