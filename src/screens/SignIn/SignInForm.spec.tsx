import { zodResolver } from '@hookform/resolvers/zod';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { SignInForm } from './SignInForm';

import { signInWithEmail } from '@/core/firebase/auth';
import { signInSchema, type SignInSchemaType } from '@/schemas/signInSchema';

jest.mock('react-native-toast-message', () => ({ show: jest.fn() }));
jest.mock('@react-native-vector-icons/material-design-icons/static', () => ({
  MaterialDesignIcons: 'MaterialDesignIcons',
}));
jest.mock('@/core/logger', () =>
  jest.fn(() => ({ logError: jest.fn(), logMessage: jest.fn() })),
);
jest.mock('@/core/firebase/auth', () => ({ signInWithEmail: jest.fn() }));

const mockSignIn = signInWithEmail as jest.Mock;

const renderForm = () => {
  const Hooked = () => {
    const methods = useForm<SignInSchemaType>({
      resolver: zodResolver(signInSchema),
    });
    return (
      <FormProvider {...methods}>
        <SignInForm forgotPasswordCallback={jest.fn()} />
      </FormProvider>
    );
  };
  return render(<Hooked />);
};

const submit = async (utils: ReturnType<typeof renderForm>) => {
  await act(async () => {
    fireEvent.changeText(
      utils.getByTestId('signIn.emailLabel'),
      ' Ada@Example.com ',
    );
  });
  await act(async () => {
    fireEvent.changeText(utils.getByTestId('signIn.passwordLabel'), 'Secret1!');
  });
  await act(() => fireEvent.press(utils.getByText('signIn.submitButton')));
};

describe('SignInForm', () => {
  beforeEach(() => jest.clearAllMocks());

  it('signs in with the trimmed, lower-case email; the session takes it from there', async () => {
    mockSignIn.mockReturnValue(new Promise(() => undefined));
    const utils = renderForm();
    await submit(utils);
    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith('ada@example.com', 'Secret1!'),
    );
  });

  it('shows "invalid email or password" for auth/invalid-credential', async () => {
    mockSignIn.mockRejectedValue({ code: 'auth/invalid-credential' });
    const utils = renderForm();
    await submit(utils);
    expect(
      await utils.findByText('fieldError.invalidEmailOrPasswordError'),
    ).toBeDefined();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('shows a toast for too many attempts', async () => {
    mockSignIn.mockRejectedValue({ code: 'auth/too-many-requests' });
    const utils = renderForm();
    await submit(utils);
    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({ text2: 'error.tooManyRequestsError' }),
      ),
    );
  });
});
