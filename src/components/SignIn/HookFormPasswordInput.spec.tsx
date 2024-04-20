import { render } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';

import { HookFormPasswordInput } from './HookFormPasswordInput';

import { SignUpFields, type SignUpSchemaType } from '@/schemas/signUpSchema';

interface TestProps {
  password: string;
}
const TestComponent: React.FC<TestProps> = ({ password }) => {
  const { control } = useForm<SignUpSchemaType>();
  return (
    <HookFormPasswordInput
      name={SignUpFields.password}
      password={password}
      control={control}
    />
  );
};

describe('HookFormPasswordInput', () => {
  it('should show special character error hint and hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="Password123" />,
    );
    expect(getByText('signUp.passwordSpecialCharacterError')).toBeTruthy();

    rerender(<TestComponent password="Password123!" />);
    expect(queryByText('signUp.passwordSpecialCharacterError')).toBeNull();
  });

  it('should show length error and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="Aaa123!" />,
    );
    expect(getByText('signUp.passwordLengthError')).toBeTruthy();

    rerender(<TestComponent password="Aaaa123!" />);
    expect(queryByText('signUp.passwordLengthError')).toBeNull();
  });

  it('should show lower upper case error and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="AAAA123!" />,
    );
    expect(getByText('signUp.passwordLowercaseError')).toBeTruthy();

    rerender(<TestComponent password="AAAa123!" />);
    expect(queryByText('signUp.passwordLowercaseError')).toBeNull();
  });

  it('should show number error and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="Aaaaaaa!" />,
    );
    expect(getByText('signUp.passwordNumberError')).toBeTruthy();

    rerender(<TestComponent password="Aaaaaaa1!" />);
    expect(queryByText('signUp.passwordNumberError')).toBeNull();
  });

  it('should show errors and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="aaaaaaa" />,
    );
    expect(getByText('signUp.passwordNumberError')).toBeTruthy();
    expect(getByText('signUp.passwordUppercaseError')).toBeTruthy();
    expect(getByText('signUp.passwordLengthError')).toBeTruthy();
    expect(getByText('signUp.passwordSpecialCharacterError')).toBeTruthy();
    expect(queryByText('signUp.passwordLowercaseError')).toBeNull();

    rerender(<TestComponent password="Aaaaaaa1!" />);

    expect(queryByText('signUp.passwordNumberError')).toBeNull();
    expect(queryByText('signUp.passwordNumberError')).toBeNull();
    expect(queryByText('signUp.passwordUppercaseError')).toBeNull();
    expect(queryByText('signUp.passwordLengthError')).toBeNull();
    expect(queryByText('signUp.passwordLowercaseError')).toBeNull();
    expect(queryByText('signUp.passwordSpecialCharacterError')).toBeNull();
  });
});
