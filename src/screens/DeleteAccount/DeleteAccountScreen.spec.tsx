import { type DrawerNavigationProp } from '@react-navigation/drawer';
import { type RouteProp } from '@react-navigation/native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

import DeleteAccountScreen from './DeleteAccountScreen';

import { deleteAccount, signOut } from '@/core/firebase/auth';
import { type SessionUser } from '@/core/firebase/types';
import {
  type DrawerParamList,
  type PrivateScreen,
} from '@/screens/Routing/Private/types';
import { getMockStore } from '@/util/mockStore';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/sso/googleSSO', () => ({
  isGoogleCancellation: jest.fn(() => false),
}));
jest.mock('@/core/sso/appleSSO', () => ({
  isAppleCancellation: jest.fn(() => false),
}));
jest.mock('@/core/firebase/auth', () => ({
  ...jest.requireActual('@/core/firebase/auth'),
  deleteAccount: jest.fn(),
  signOut: jest.fn(() => Promise.resolve()),
}));

const passwordUser: SessionUser = {
  uid: 'uid-1',
  email: 'ada@example.com',
  emailVerified: true,
  displayName: null,
  providerIds: ['password'],
};

const navigation = {} as DrawerNavigationProp<
  DrawerParamList,
  PrivateScreen.DeleteAccount
>;
const route = {} as RouteProp<DrawerParamList, PrivateScreen.DeleteAccount>;

const renderScreen = (user: SessionUser = passwordUser) =>
  render(
    <Provider store={getMockStore({ user })}>
      <DeleteAccountScreen navigation={navigation} route={route} />
    </Provider>,
  );

const pressDelete = () =>
  act(() => fireEvent.press(screen.getByTestId('delete-account-cta')));

describe('DeleteAccountScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes the account, confirms it and signs out', async () => {
    (deleteAccount as jest.Mock).mockResolvedValue(undefined);
    renderScreen();
    await pressDelete();
    expect(deleteAccount).toHaveBeenCalledWith({});
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({ text1: 'deleteAccount.successTitle' }),
    );
    expect(signOut).toHaveBeenCalled();
  });

  it('asks for the password after requires-recent-login, then deletes with it', async () => {
    (deleteAccount as jest.Mock)
      .mockRejectedValueOnce({ code: 'auth/requires-recent-login' })
      .mockResolvedValueOnce(undefined);
    renderScreen();
    await pressDelete();
    expect(
      screen.getByText('deleteAccount.reauthDescription'),
    ).toBeOnTheScreen();

    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId('deleteAccount.passwordLabel'),
        'Secret1!',
      );
    });
    await pressDelete();
    expect(deleteAccount).toHaveBeenLastCalledWith({ password: 'Secret1!' });
    expect(signOut).toHaveBeenCalled();
  });

  it('shows "invalid password" when the re-authentication fails', async () => {
    (deleteAccount as jest.Mock)
      .mockRejectedValueOnce({ code: 'auth/requires-recent-login' })
      .mockRejectedValueOnce({ code: 'auth/invalid-credential' });
    renderScreen();
    await pressDelete();
    await act(async () => {
      fireEvent.changeText(
        screen.getByTestId('deleteAccount.passwordLabel'),
        'wrong',
      );
    });
    await pressDelete();
    expect(
      screen.getByText('fieldError.invalidEmailOrPasswordError'),
    ).toBeOnTheScreen();
    expect(signOut).not.toHaveBeenCalled();
  });

  it('does nothing when a Google re-auth is cancelled', async () => {
    (deleteAccount as jest.Mock).mockRejectedValue({
      code: 'app/sign-in-cancelled',
    });
    renderScreen({ ...passwordUser, providerIds: ['google.com'] });
    await pressDelete();
    expect(screen.queryByText('error.unexpectedErrorRetry')).toBeNull();
    expect(screen.getByTestId('delete-account-cta')).toBeOnTheScreen();
  });
});
