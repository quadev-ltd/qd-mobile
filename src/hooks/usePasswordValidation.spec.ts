import { renderHook } from '@testing-library/react-hooks';

import {
  isPasswordValid,
  usePasswordValidation,
} from './usePasswordValidation';

jest.mock('@react-native-firebase/crashlytics', () => ({
  log: jest.fn(),
  recordError: jest.fn(),
}));

describe('isPasswordValid', () => {
  it('validates password correctly', () => {
    const password = 'Password123!';
    const result = isPasswordValid(password);
    expect(result.isValid).toBe(true);
    expect(result.hasUpperCase).toBe(true);
    expect(result.hasLowerCase).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecialChar).toBe(true);
    expect(result.hasLength).toBe(true);
  });

  it('identifies an invalid password', () => {
    const password = 'pass'; // Too short and missing criteria
    const result = isPasswordValid(password);
    expect(result.hasNumber).toBe(false);
    expect(result.isValid).toBe(false);
    expect(result.hasUpperCase).toBe(false);
    expect(result.hasLength).toBe(false);
    expect(result.hasLowerCase).toBe(true);
    expect(result.hasSpecialChar).toBe(false);
  });
  it('identifies an invalid password missing number and lower case', () => {
    const password = 'PASS!'; // Too short and missing criteria
    const result = isPasswordValid(password);
    expect(result.hasNumber).toBe(false);
    expect(result.isValid).toBe(false);
    expect(result.hasUpperCase).toBe(true);
    expect(result.hasLength).toBe(false);
    expect(result.hasLowerCase).toBe(false);
    expect(result.hasSpecialChar).toBe(true);
  });

  it('identifies an invalid password only numbers', () => {
    const password = '12345678'; // Too short and missing criteria
    const result = isPasswordValid(password);
    expect(result.hasNumber).toBe(true);
    expect(result.isValid).toBe(false);
    expect(result.hasUpperCase).toBe(false);
    expect(result.hasLength).toBe(true);
    expect(result.hasLowerCase).toBe(false);
    expect(result.hasSpecialChar).toBe(false);
  });
});

describe('usePasswordValidation', () => {
  it('initially sets isValid to true if if password is undefined or empty', () => {
    const { result } = renderHook(() => usePasswordValidation(undefined));

    expect(result.current.isValid).toBe(true);
    expect(result.current.hasUpperCase).toBe(false);
    expect(result.current.hasLowerCase).toBe(false);
    expect(result.current.hasNumber).toBe(false);
    expect(result.current.hasSpecialChar).toBe(false);
    expect(result.current.hasLength).toBe(false);
  });
  it('initially sets all validation states to false other than lower case check', () => {
    const { result } = renderHook(() => usePasswordValidation('a'));

    expect(result.current.isValid).toBe(false);
    expect(result.current.hasUpperCase).toBe(false);
    expect(result.current.hasLowerCase).toBe(true);
    expect(result.current.hasNumber).toBe(false);
    expect(result.current.hasSpecialChar).toBe(false);
    expect(result.current.hasLength).toBe(false);
  });

  it('initially sets all validation states to true', () => {
    const { result } = renderHook(() => usePasswordValidation('Password123!'));

    expect(result.current.isValid).toBe(true);
    expect(result.current.hasUpperCase).toBe(true);
    expect(result.current.hasLowerCase).toBe(true);
    expect(result.current.hasNumber).toBe(true);
    expect(result.current.hasSpecialChar).toBe(true);
    expect(result.current.hasLength).toBe(true);
  });
});
