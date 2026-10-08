import { zodResolver } from '@hookform/resolvers/zod';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { FormProvider, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { type MockStoreEnhanced } from 'redux-mock-store';

import { SignUpForm } from './SignUpForm';

import { signUpWithEmail } from '@/core/firebase/auth';
import {
  SignUpFields,
  signUpSchema,
  type SignUpSchemaType,
} from '@/schemas/signUpSchema';
import { getMockStore } from '@/util/mockStore';

const mockLogger = {
  logError: jest.fn(),
  logMessage: jest.fn(),
};

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));
jest.mock('@react-native-firebase/crashlytics');
jest.mock('@/core/firebase/auth', () => ({
  signUpWithEmail: jest.fn(),
}));
jest.mock('@/core/logger', () =>
  jest.fn().mockImplementation(() => mockLogger),
);

const mockSignUpWithEmail = signUpWithEmail as jest.Mock;

const validData: Record<string, string> = {
  [SignUpFields.email]: ' Test@Test.com ',
  [SignUpFields.firstName]: 'John',
  [SignUpFields.lastName]: 'Doe',
  [SignUpFields.dob]: '29/02/2024',
  [SignUpFields.password]: 'Password123!',
  [SignUpFields.passwordConfirmation]: 'Password123!',
};

const inputTestIDs: Record<string, string> = {
  [SignUpFields.email]: 'signUp.emailLabel',
  [SignUpFields.firstName]: 'signUp.firstNameLabel',
  [SignUpFields.lastName]: 'signUp.lastNameLabel',
  [SignUpFields.dob]: 'signUp.dobLabel',
  [SignUpFields.password]: 'signUp.passwordLabel',
  [SignUpFields.passwordConfirmation]: 'signUp.passwordConfirmationLabel',
};

const firebaseError = (code: string) =>
  Object.assign(new Error(`[${code}] message`), { code });

const { show: mockShowToast } = Toast;

describe('SignUpForm with Firebase', () => {
  let store: MockStoreEnhanced<unknown>;
  const renderComponent = () => {
    const HookedSignUpForm = () => {
      const methods = useForm<SignUpSchemaType>({
        resolver: zodResolver(signUpSchema),
      });
      return (
        <Provider store={store}>
          <FormProvider {...methods}>
            <SignUpForm />
          </FormProvider>
        </Provider>
      );
    };
    return render(<HookedSignUpForm />);
  };

  const fillAndSubmit = async (
    utils: ReturnType<typeof renderComponent>,
    overrides: Record<string, string> = {},
  ) => {
    const data = { ...validData, ...overrides };
    for (const key of Object.values(SignUpFields)) {
      await act(async () => {
        fireEvent.changeText(utils.getByTestId(inputTestIDs[key]), data[key]);
      });
    }
    await act(() => fireEvent.press(utils.getByText('signUp.submitButton')));
  };

  beforeEach(() => {
    mockSignUpWithEmail.mockReset();
    (mockShowToast as jest.Mock).mockReset();
    mockLogger.logError.mockReset();
    mockLogger.logMessage.mockReset();
    store = getMockStore();
  });

  it('should render successfully', () => {
    const { getByText } = renderComponent();
    expect(getByText('signUp.submitButton')).toBeDefined();
  });

  it('creates the account with a normalised email and an ISO date of birth', async () => {
    mockSignUpWithEmail.mockResolvedValue({ uid: 'uid-1' });
    const utils = renderComponent();
    await fillAndSubmit(utils);

    await waitFor(() => expect(mockSignUpWithEmail).toHaveBeenCalledTimes(1));
    expect(mockSignUpWithEmail).toHaveBeenCalledWith(
      'test@test.com',
      'Password123!',
      { firstName: 'John', lastName: 'Doe', dateOfBirth: '2024-02-29' },
    );
  });

  it('creates the account without a date of birth when it is left empty (D16)', async () => {
    mockSignUpWithEmail.mockResolvedValue({ uid: 'uid-1' });
    const utils = renderComponent();
    await fillAndSubmit(utils, { [SignUpFields.dob]: '' });

    await waitFor(() => expect(mockSignUpWithEmail).toHaveBeenCalledTimes(1));
    expect(mockSignUpWithEmail.mock.calls[0][2]).toEqual({
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('shows "email already in use" on the email field', async () => {
    mockSignUpWithEmail.mockRejectedValue(
      firebaseError('auth/email-already-in-use'),
    );
    const utils = renderComponent();
    await fillAndSubmit(utils);

    expect(
      await utils.findByText('fieldError.emailAlreadyUsedError'),
    ).toBeDefined();
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('shows the password policy error on the password field', async () => {
    mockSignUpWithEmail.mockRejectedValue(
      firebaseError('auth/password-does-not-meet-requirements'),
    );
    const utils = renderComponent();
    await fillAndSubmit(utils);

    expect(
      await utils.findByText('fieldError.passwordNotComplexError'),
    ).toBeDefined();
  });

  it('shows a toast and logs only the error code for unknown errors', async () => {
    mockSignUpWithEmail.mockRejectedValue(firebaseError('auth/internal-error'));
    const utils = renderComponent();
    await fillAndSubmit(utils);

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith({
        type: 'error',
        text1: 'error.errorTitle',
        text2: 'error.unexpectedErrorRetry',
        position: 'bottom',
      }),
    );
    expect(mockLogger.logError).toHaveBeenCalledWith(
      new Error('signUp failed: code=auth/internal-error'),
    );
    const logged = JSON.stringify(mockLogger.logError.mock.calls);
    expect(logged).not.toContain('test@test.com');
    expect(logged).not.toContain('John');
  });

  it('shows a network error toast', async () => {
    mockSignUpWithEmail.mockRejectedValue(
      firebaseError('auth/network-request-failed'),
    );
    const utils = renderComponent();
    await fillAndSubmit(utils);

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({ text2: 'error.networkError' }),
      ),
    );
  });
});

describe('SignUpForm individual errors', () => {
  let store: MockStoreEnhanced<unknown>;
  const renderComponent = () => {
    const HookedSignUpForm = () => {
      const methods = useForm<SignUpSchemaType>({
        resolver: zodResolver(signUpSchema),
      });
      return (
        <Provider store={store}>
          <FormProvider {...methods}>
            <SignUpForm />
          </FormProvider>
        </Provider>
      );
    };
    return render(<HookedSignUpForm />);
  };
  beforeEach(() => {
    store = getMockStore();
  });
  // give me one day in the future
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 2);
  const day = futureDate.getDate().toString().padStart(2, '0');
  const month = (futureDate.getMonth() + 1).toString().padStart(2, '0');
  const year = futureDate.getFullYear();
  const futureDateString = `${day}/${month}/${year}`;
  const testCases = [
    {
      testFieldKey: SignUpFields.email,
      testFieldValue: undefined,
      expectedError: 'emailRequiredError',
    },
    {
      testFieldKey: SignUpFields.email,
      testFieldValue: 'invalid-email',
      expectedError: 'emailFormatError',
    },
    {
      testFieldKey: SignUpFields.firstName,
      testFieldValue: undefined,
      expectedError: 'firstNameRequiredError',
    },
    {
      testFieldKey: SignUpFields.firstName,
      testFieldValue:
        'This is a very long name to trigger the length in the name field',
      expectedError: 'firstNameLengthError',
    },
    {
      testFieldKey: SignUpFields.lastName,
      testFieldValue: undefined,
      expectedError: 'lastNameRequiredError',
    },
    {
      testFieldKey: SignUpFields.lastName,
      testFieldValue:
        'This is a very long last name to trigger the length in the name field',
      expectedError: 'lastNameLengthError',
    },
    {
      testFieldKey: SignUpFields.dob,
      testFieldValue: '2000/12/12',
      expectedError: 'dobFormatError',
    },
    {
      testFieldKey: SignUpFields.dob,
      testFieldValue: futureDateString,
      expectedError: 'dobFutureError',
    },
    {
      testFieldKey: SignUpFields.password,
      testFieldValue: undefined,
      expectedError: 'passwordRequiredError',
    },
    {
      testFieldKey: SignUpFields.password,
      testFieldValue: 'password',
      expectedError: 'passwordFormatError',
    },
    {
      testFieldKey: SignUpFields.passwordConfirmation,
      testFieldValue: 'password',
      expectedError: 'passwordConfirmationMatchError',
    },
  ];
  test.each(testCases)(
    'should render $expectedError for $testFieldKey with value $testFieldValue',
    async ({ testFieldKey, testFieldValue, expectedError }) => {
      const { getByText, getByTestId, findByText } = renderComponent();

      for (const key of Object.values(SignUpFields)) {
        const value = key === testFieldKey ? testFieldValue : validData[key];
        await act(() =>
          fireEvent.changeText(getByTestId(inputTestIDs[key]), value),
        );
      }

      await act(() => fireEvent.press(getByText('signUp.submitButton')));

      // Wait for and check the expected error message
      await waitFor(
        async () => {
          expect(await findByText(`fieldError.${expectedError}`)).toBeDefined();
        },
        { timeout: 1000 },
      );
    },
  );

  it('should render required errors', async () => {
    const { getByText, findByText } = renderComponent();

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      async () => {
        const element = await findByText('fieldError.emailRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('fieldError.firstNameRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('fieldError.lastNameRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('fieldError.passwordRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
  });
});
