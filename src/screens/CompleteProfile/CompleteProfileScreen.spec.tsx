import { type RouteProp } from '@react-navigation/native';
import { type NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import { CompleteProfileScreen } from './CompleteProfileScreen';
import { getPrefilledNames } from './useCompleteProfile';

import { signOut } from '@/core/firebase/auth';
import { saveProfile } from '@/core/firebase/profile';
import { type SessionUser } from '@/core/firebase/types';
import { type SessionState } from '@/core/state/slices/sessionSlice';
import {
  type OnboardingParamList,
  type OnboardingScreen,
} from '@/screens/Routing/Onboarding/types';
import { getMockStore } from '@/util/mockStore';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/firebase/auth', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));
jest.mock('@/core/firebase/profile', () => ({
  ...jest.requireActual('@/core/firebase/profile'),
  saveProfile: jest.fn(),
}));

const appleUser: SessionUser = {
  uid: 'uid-1',
  email: 'relay@privaterelay.appleid.com',
  emailVerified: true,
  displayName: null,
  providerIds: ['apple.com'],
};

const navigation = {} as NativeStackNavigationProp<
  OnboardingParamList,
  OnboardingScreen.CompleteProfile
>;
const route = {} as RouteProp<
  OnboardingParamList,
  OnboardingScreen.CompleteProfile
>;

const renderScreen = (session: Partial<SessionState>) =>
  render(
    <Provider store={getMockStore({ user: appleUser, ...session })}>
      <CompleteProfileScreen navigation={navigation} route={route} />
    </Provider>,
  );

describe('CompleteProfileScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('prefills the names the provider sent and saves without a date of birth', async () => {
    (saveProfile as jest.Mock).mockReturnValue(new Promise(() => undefined));
    renderScreen({ providerNames: { firstName: 'Ada', lastName: 'Lovelace' } });
    expect(screen.getByTestId('signUp.firstNameLabel').props.value).toBe('Ada');
    await act(() =>
      fireEvent.press(screen.getByTestId('complete-profile-cta')),
    );
    expect(saveProfile).toHaveBeenCalledWith('uid-1', {
      firstName: 'Ada',
      lastName: 'Lovelace',
    });
  });

  it('requires the missing last name (Apple returning user without a name)', async () => {
    renderScreen({ providerNames: { firstName: 'Ada' } });
    await act(() =>
      fireEvent.press(screen.getByTestId('complete-profile-cta')),
    );
    expect(
      await screen.findByText('fieldError.lastNameRequiredError'),
    ).toBeOnTheScreen();
    expect(saveProfile).not.toHaveBeenCalled();
  });

  it('saves an entered date of birth as YYYY-MM-DD', async () => {
    (saveProfile as jest.Mock).mockReturnValue(new Promise(() => undefined));
    renderScreen({ providerNames: { firstName: 'Ada', lastName: 'L' } });
    await act(async () => {
      fireEvent.changeText(screen.getByTestId('signUp.dobLabel'), '10/12/1985');
    });
    await act(() =>
      fireEvent.press(screen.getByTestId('complete-profile-cta')),
    );
    expect(saveProfile).toHaveBeenCalledWith('uid-1', {
      firstName: 'Ada',
      lastName: 'L',
      dateOfBirth: '1985-12-10',
    });
  });

  it('shows the error when saving fails', async () => {
    (saveProfile as jest.Mock).mockRejectedValue({
      code: 'firestore/permission-denied',
    });
    renderScreen({ providerNames: { firstName: 'Ada', lastName: 'L' } });
    await act(() =>
      fireEvent.press(screen.getByTestId('complete-profile-cta')),
    );
    expect(await screen.findByText('error.serverSideError')).toBeOnTheScreen();
  });

  it('lets the user sign out instead', async () => {
    renderScreen({});
    await act(() =>
      fireEvent.press(screen.getByText('completeProfile.changePathButton')),
    );
    expect(signOut).toHaveBeenCalled();
  });
});

describe('getPrefilledNames', () => {
  it('prefers the provider names, then the display name', () => {
    expect(
      getPrefilledNames(
        { ...appleUser, displayName: 'Grace Brewster Hopper' },
        null,
        null,
      ),
    ).toEqual({ firstName: 'Grace', lastName: 'Brewster Hopper' });
    expect(
      getPrefilledNames(
        { ...appleUser, displayName: 'Grace Hopper' },
        { firstName: 'Ada' },
        null,
      ),
    ).toEqual({ firstName: 'Ada', lastName: 'Hopper' });
    expect(getPrefilledNames(null, null, null)).toEqual({
      firstName: undefined,
      lastName: undefined,
    });
  });
});
