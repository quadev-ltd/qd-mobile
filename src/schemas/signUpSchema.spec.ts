import { type SafeParseError } from 'zod';

import { signUpSchema, SignUpFields } from './signUpSchema';

describe('signUpSchema', () => {
  const validData = {
    [SignUpFields.email]: 'test@example.com',
    [SignUpFields.firstName]: 'John',
    [SignUpFields.lastName]: 'Doe',
    [SignUpFields.dob]: '29/02/2024',
    [SignUpFields.password]: 'Password123!',
    [SignUpFields.passwordConfirmation]: 'Password123!',
  };

  it('should validate valid data', async () => {
    const result = signUpSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail with date in future error', async () => {
    const invalidData = { ...validData, [SignUpFields.dob]: '12/12/2050' };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();

    expect(
      (result as SafeParseError<SignUpFields>).error.errors[0].message,
    ).toBe('fieldError.dobFutureError');
  });

  it('should fail with date invalid error', async () => {
    const invalidData = { ...validData, [SignUpFields.dob]: '29/02/2022' };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();

    expect(
      (result as SafeParseError<SignUpFields>).error.errors[0].message,
    ).toBe('fieldError.dobFormatError');
  });

  it('should fail with invalid email', async () => {
    const invalidData = { ...validData, [SignUpFields.email]: 'invalid-email' };
    const result = signUpSchema.safeParse(invalidData);
    expect(result.success).toBeFalsy();

    expect(
      (result as SafeParseError<SignUpFields>).error.errors[0].message,
    ).toBe('fieldError.emailFormatError');
  });

  it('should fail with missing required fields', async () => {
    const incompleteData = {
      [SignUpFields.email]: 'test@example.com',
      [SignUpFields.firstName]: undefined,
      [SignUpFields.lastName]: '',
      [SignUpFields.dob]: '',
      [SignUpFields.password]: '',
      [SignUpFields.passwordConfirmation]: '',
    };
    const result = signUpSchema.safeParse(incompleteData);
    expect(result.success).toBe(false);

    expect(
      (result as SafeParseError<SignUpFields>).error.errors[0].message,
    ).toBe('fieldError.firstNameRequiredError');
    expect(
      (result as SafeParseError<SignUpFields>).error.errors[1].message,
    ).toBe('fieldError.lastNameRequiredError');
    expect(
      (result as SafeParseError<SignUpFields>).error.errors[2].message,
    ).toBe('fieldError.dobRequiredError');
    expect(
      (result as SafeParseError<SignUpFields>).error.errors[3].message,
    ).toBe('fieldError.dobFormatError');
    expect(
      (result as SafeParseError<SignUpFields>).error.errors[4].message,
    ).toBe('fieldError.passwordFormatError');
  });

  it('should fail with non-matching passwords', async () => {
    const nonMatchingPasswords = {
      ...validData,
      [SignUpFields.passwordConfirmation]: 'differentPassword',
    };
    const result = signUpSchema.safeParse(nonMatchingPasswords);
    expect(result.success).toBe(false);
    expect(
      (result as SafeParseError<SignUpFields>).error.errors[0].message,
    ).toBe('fieldError.passwordConfirmationMatchError');
  });

  // Add more test cases for other validation rules (e.g., firstName/lastName length, dob format, password validation, etc.)
});
