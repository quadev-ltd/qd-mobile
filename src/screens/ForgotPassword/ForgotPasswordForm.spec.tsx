import { act, fireEvent, render, screen } from '@testing-library/react-native';

import ForgotPasswordForm from './ForgotPasswordForm';

import { sendPasswordReset } from '@/core/firebase/auth';

jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/firebase/auth', () => ({ sendPasswordReset: jest.fn() }));

const renderForm = () =>
  render(
    <ForgotPasswordForm
      emailLabel="email"
      emailAccessibilityLabel="email"
      defaultEmail=""
      submitLabel="submit"
      submitAccessibilityLabel="submit"
    />,
  );

const submit = async (email: string) => {
  await act(async () => {
    fireEvent.changeText(screen.getByTestId('email'), email);
  });
  await act(() => fireEvent.press(screen.getByText('submit')));
};

describe('ForgotPasswordForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('sends the reset email and shows the neutral message', async () => {
    (sendPasswordReset as jest.Mock).mockResolvedValue(undefined);
    renderForm();
    await submit(' Ada@Example.com ');
    expect(sendPasswordReset).toHaveBeenCalledWith('ada@example.com');
    expect(screen.getByText('forgotPassword.success')).toBeOnTheScreen();
  });

  it('shows the same neutral message when no account exists', async () => {
    (sendPasswordReset as jest.Mock).mockRejectedValue({
      code: 'auth/user-not-found',
    });
    renderForm();
    await submit('nobody@example.com');
    expect(screen.getByText('forgotPassword.success')).toBeOnTheScreen();
    expect(screen.queryByText('forgotPassword.tryAgain')).toBeNull();
  });

  it('shows a network error and lets the user try again', async () => {
    (sendPasswordReset as jest.Mock).mockRejectedValue({
      code: 'auth/network-request-failed',
    });
    renderForm();
    await submit('ada@example.com');
    expect(screen.getByText('error.networkError')).toBeOnTheScreen();
    await act(() =>
      fireEvent.press(screen.getByText('forgotPassword.tryAgain')),
    );
    expect(screen.getByText('submit')).toBeOnTheScreen();
  });
});
