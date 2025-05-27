import { type DrawerScreenProps } from '@react-navigation/drawer';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from 'react-native-paper';

import CTA from '@/components/CTA';
import Header from '@/components/Header';
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

export type DeleteAccountScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.DeleteAccount
>;

const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
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
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {isLoading ? (
          <>
            <Spinner />
            <Header
              subtitle={t('deleteAccount.deleting')}
              subtitleAccessibilityLabel={t('deleteAccount.deleting')}
            />
          </>
        ) : (
          <View style={styles.textContainer}>
            <Header
              title={t('deleteAccount.title')}
              titleAccessibilityLabel={t('deleteAccount.title')}
              subtitle={t('deleteAccount.description')}
              subtitleAccessibilityLabel={t('deleteAccount.description')}
            />
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
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  textContainer: {
    flex: 2,
  },
});

export default DeleteAccountScreen;
