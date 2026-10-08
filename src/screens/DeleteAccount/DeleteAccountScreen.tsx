import { type DrawerScreenProps } from '@react-navigation/drawer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDeleteAccount } from './useDeleteAccount';

import CTA from '@/components/CTA';
import { FormTextInput } from '@/components/FormTextInput';
import Header from '@/components/Header';
import ErrorMessage from '@/components/SignIn/ErrorMessage';
import Spinner from '@/components/Spinner';
import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';

export type DeleteAccountScreenProps = DrawerScreenProps<
  DrawerParamList,
  PrivateScreen.DeleteAccount
>;

const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [password, setPassword] = useState('');
  const { isDeleting, handleDeleteAccount, errorMessage, needsPassword } =
    useDeleteAccount();

  const onConfirm = () =>
    needsPassword ? handleDeleteAccount(password) : handleDeleteAccount();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {isDeleting ? (
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
              subtitle={t(
                needsPassword
                  ? 'deleteAccount.reauthDescription'
                  : 'deleteAccount.description',
              )}
              subtitleAccessibilityLabel={t(
                needsPassword
                  ? 'deleteAccount.reauthDescription'
                  : 'deleteAccount.description',
              )}
            />
            {needsPassword && (
              <FormTextInput
                label={t('deleteAccount.passwordLabel')}
                accessibilityLabel={t('deleteAccount.passwordLabel')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onSubmitEditing={onConfirm}
              />
            )}
            {errorMessage && (
              <ErrorMessage
                text={errorMessage}
                accessibilityLabel={errorMessage}
              />
            )}
            <View style={styles.buttonContainer}>
              <CTA
                testID="delete-account-cta"
                disabled={needsPassword && password.length === 0}
                text={t('deleteAccount.deleteButton')}
                accessibilityLabel={t(
                  'deleteAccount.deleteButtonAccessibilityLabel',
                )}
                onPress={onConfirm}
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
