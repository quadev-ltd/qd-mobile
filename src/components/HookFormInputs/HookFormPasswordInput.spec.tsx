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
    <HookFormPasswordInput<SignUpSchemaType>
      label="password"
      accessibilityLabel="password"
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
    expect(getByText('fieldError.passwordSpecialCharacterError')).toBeTruthy();

    rerender(<TestComponent password="Password123!" />);
    expect(queryByText('fieldError.passwordSpecialCharacterError')).toBeNull();
  });

  it('should show length error and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="Aaa123!" />,
    );
    expect(getByText('fieldError.passwordLengthError')).toBeTruthy();

    rerender(<TestComponent password="Aaaa123!" />);
    expect(queryByText('fieldError.passwordLengthError')).toBeNull();
  });

  it('should show lower upper case error and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="AAAA123!" />,
    );
    expect(getByText('fieldError.passwordLowercaseError')).toBeTruthy();

    rerender(<TestComponent password="AAAa123!" />);
    expect(queryByText('fieldError.passwordLowercaseError')).toBeNull();
  });

  it('should show number error and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="Aaaaaaa!" />,
    );
    expect(getByText('fieldError.passwordNumberError')).toBeTruthy();

    rerender(<TestComponent password="Aaaaaaa1!" />);
    expect(queryByText('fieldError.passwordNumberError')).toBeNull();
  });

  it('should show errors and then hide it', () => {
    const { getByText, queryByText, rerender } = render(
      <TestComponent password="aaaaaaa" />,
    );
    expect(getByText('fieldError.passwordNumberError')).toBeTruthy();
    expect(getByText('fieldError.passwordUppercaseError')).toBeTruthy();
    expect(getByText('fieldError.passwordLengthError')).toBeTruthy();
    expect(getByText('fieldError.passwordSpecialCharacterError')).toBeTruthy();
    expect(queryByText('fieldError.passwordLowercaseError')).toBeNull();

    rerender(<TestComponent password="Aaaaaaa1!" />);

    expect(queryByText('fieldError.passwordNumberError')).toBeNull();
    expect(queryByText('fieldError.passwordNumberError')).toBeNull();
    expect(queryByText('fieldError.passwordUppercaseError')).toBeNull();
    expect(queryByText('fieldError.passwordLengthError')).toBeNull();
    expect(queryByText('fieldError.passwordLowercaseError')).toBeNull();
    expect(queryByText('fieldError.passwordSpecialCharacterError')).toBeNull();
  });
});
