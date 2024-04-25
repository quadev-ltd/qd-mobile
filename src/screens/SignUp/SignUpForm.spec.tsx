import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import {
  type TextMatch,
  type TextMatchOptions,
} from '@testing-library/react-native/build/matches';
import { type GetByQuery } from '@testing-library/react-native/build/queries/make-queries';
import { type CommonQueryOptions } from '@testing-library/react-native/build/queries/options';
import Toast from 'react-native-toast-message';

import { SignUpForm } from './SignUpForm';

import { FieldErrors, type ResponseError } from '@/core/api/types';
import { SignUpFields } from '@/schemas/signUpSchema';

const mockRegisterUser = jest.fn();
const mockLogger = {
  logError: jest.fn(),
  logMessage: jest.fn(),
};

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));
jest.mock('../../core/api', () => ({
  useSignUpMutation: jest.fn(() => [mockRegisterUser, { iLoading: false }]),
}));
jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
}));

jest.mock('@/core/logger', () =>
  jest.fn().mockImplementation(() => mockLogger),
);

const validData: Record<string, string> = {
  [SignUpFields.email]: 'test@test.com',
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

const onSuccess = jest.fn();

const successResponseData = {
  success: true,
  message: 'success',
  user: {
    userID: '123d768a98df',
    firstName: 'John',
  },
};

const failResponseData = {
  success: false,
  message: 'failure',
};

const knownResponseEmailInUse: ResponseError = {
  status: 400,
  data: {
    error: 'error',
    field_errors: [
      {
        field: SignUpFields.email,
        error: FieldErrors.AlreadyUsed,
      },
    ],
  },
};

async function fillFormFields(
  getByTestId: GetByQuery<TextMatch, CommonQueryOptions & TextMatchOptions>,
): Promise<void> {
  for (const key of Object.values(SignUpFields)) {
    const fieldTestId = inputTestIDs[key];
    const fieldValue = validData[key];
    if (!fieldTestId) {
      throw new Error(`Test ID not found for field: ${key}`);
    }
    const fieldElement = getByTestId(fieldTestId);
    await act(async () => {
      fireEvent.changeText(fieldElement, fieldValue);
    });
  }
}
const { show: mockShowToast } = Toast;
describe('SignUpForm complete success and errors', () => {
  beforeEach(() => {
    onSuccess.mockReset();
    mockRegisterUser.mockReset();
    (mockShowToast as jest.Mock).mockReset();
    mockLogger.logError.mockReset();
    mockLogger.logMessage.mockReset();
  });

  it('should render successfully', () => {
    const { getByText } = render(<SignUpForm onSuccess={onSuccess} />);
    expect(getByText('signUp.submitButton')).toBeDefined();
  });
  it('should submit full success', async () => {
    const { getByText, getByTestId } = render(
      <SignUpForm onSuccess={onSuccess} />,
    );
    mockRegisterUser.mockReturnValue({
      unwrap: () => Promise.resolve(successResponseData),
    });
    await fillFormFields(getByTestId);

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      () => {
        expect(mockRegisterUser).toHaveBeenCalledTimes(1);
      },
      { timeout: 1000 },
    );
    await waitFor(
      () => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 },
    );
  });

  it('should submit successfully but response is not successful', async () => {
    const { getByText, getByTestId } = render(
      <SignUpForm onSuccess={onSuccess} />,
    );
    mockRegisterUser.mockReturnValue({
      unwrap: () => Promise.resolve(failResponseData),
    });
    await fillFormFields(getByTestId);

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      () => {
        expect(mockRegisterUser).toHaveBeenCalledTimes(1);
        expect(mockLogger.logError).toHaveBeenCalledWith(
          Error(
            `Unknown registration error for email ${
              validData[SignUpFields.email]
            }: {}`,
          ),
        );
      },
      { timeout: 1000 },
    );
  });

  it('should submit successfully but response returns a known error', async () => {
    const { getByText, getByTestId, findByText } = render(
      <SignUpForm onSuccess={onSuccess} />,
    );
    mockRegisterUser.mockReturnValue({
      unwrap: () => Promise.reject(knownResponseEmailInUse),
    });

    await fillFormFields(getByTestId);

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      async () => {
        expect(mockRegisterUser).toHaveBeenCalledTimes(1);
        expect(await findByText(`signUp.emailAlreadyUsedError`)).toBeDefined();
      },
      { timeout: 1000 },
    );
  });

  it('should submit successfully but response returns a UNKNOWN error', async () => {
    const { getByText, getByTestId } = render(
      <SignUpForm onSuccess={onSuccess} />,
    );
    const unkonwResponseError: ResponseError = Object.assign(
      {},
      knownResponseEmailInUse,
    );
    if (unkonwResponseError.data?.field_errors) {
      unkonwResponseError.data.field_errors[0].error = 'unknown_error';
    }

    mockRegisterUser.mockReturnValue({
      unwrap: () => Promise.reject(unkonwResponseError),
    });
    await fillFormFields(getByTestId);

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      async () => {
        expect(mockRegisterUser).toHaveBeenCalledTimes(1);
        expect(mockLogger.logError).toHaveBeenCalledTimes(1);
        expect(mockLogger.logError).toHaveBeenCalledWith(
          Error(
            `Unknown registration error for email ${
              validData[SignUpFields.email]
            }: ${JSON.stringify(unkonwResponseError)}`,
          ),
        );
        expect(mockShowToast).toHaveBeenCalledWith({
          type: 'error',
          text1: 'toast.errorTitle',
          text2: 'toast.unexpectedErrorRetry',
          position: 'bottom',
        });
      },
      { timeout: 1000 },
    );
  });

  it('should submit successfully but response returns a 500 error', async () => {
    const { getByText, getByTestId } = render(
      <SignUpForm onSuccess={onSuccess} />,
    );

    const internalServerResponseError: ResponseError = Object.assign(
      {},
      knownResponseEmailInUse,
    );
    internalServerResponseError.status = 500;

    mockRegisterUser.mockReturnValue({
      unwrap: () => Promise.reject(internalServerResponseError),
    });
    await fillFormFields(getByTestId);

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      async () => {
        expect(mockRegisterUser).toHaveBeenCalledTimes(1);
        expect(mockLogger.logError).toHaveBeenCalledTimes(1);
        expect(mockLogger.logError).toHaveBeenCalledWith(
          Error(
            `Unknown registration error for email ${
              validData[SignUpFields.email]
            }: ${JSON.stringify(internalServerResponseError)}`,
          ),
        );
        expect(mockShowToast).toHaveBeenCalledWith({
          type: 'error',
          text1: 'toast.errorTitle',
          text2: 'toast.unexpectedErrorRetry',
          position: 'bottom',
        });
      },
      { timeout: 1000 },
    );
  });
});

describe('SignUpForm individual errors', () => {
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
      testFieldValue: undefined,
      expectedError: 'dobRequiredError',
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
      const { getByText, getByTestId, findByText } = render(
        <SignUpForm onSuccess={onSuccess} />,
      );

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
          expect(await findByText(`signUp.${expectedError}`)).toBeDefined();
        },
        { timeout: 1000 },
      );
    },
  );

  it('should render required errors', async () => {
    const { getByText, findByText } = render(
      <SignUpForm onSuccess={onSuccess} />,
    );

    await act(() => fireEvent.press(getByText('signUp.submitButton')));

    await waitFor(
      async () => {
        const element = await findByText('signUp.emailRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('signUp.firstNameRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('signUp.lastNameRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('signUp.dobRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
    await waitFor(
      async () => {
        const element = await findByText('signUp.passwordRequiredError');
        expect(element).toBeDefined();
      },
      { timeout: 1000 },
    );
  });
});
