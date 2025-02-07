import { useEffect, useState } from 'react';

export const upperCaseRegex = /[A-Z]/;
export const lowerCaseRegex = /[a-z]/;
export const numberRegex = /[0-9]/;
export const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
export const passwordLength = 8;

export interface PasswordValidityAttributes {
  isValid: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasLength: boolean;
  [key: string]: boolean;
}

export const isPasswordValid = (
  password: string,
): PasswordValidityAttributes => {
  const checkUpperCase = upperCaseRegex.test(password);
  const checkLowerCase = lowerCaseRegex.test(password);
  const checkNumber = numberRegex.test(password);
  const checkSpecialChar = specialCharRegex.test(password);
  const checkLength = password.length >= 8;
  const isValid =
    checkUpperCase &&
    checkLowerCase &&
    checkNumber &&
    checkSpecialChar &&
    checkLength;
  return {
    isValid,
    hasUpperCase: checkUpperCase,
    hasLowerCase: checkLowerCase,
    hasNumber: checkNumber,
    hasSpecialChar: checkSpecialChar,
    hasLength: checkLength,
  };
};

export const usePasswordValidation = (
  password?: string,
): PasswordValidityAttributes => {
  const [hasUpperCase, setHasUpperCase] = useState(false);
  const [hasLowerCase, setHasLowerCase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasLength, setHasLength] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (password) {
      const {
        isValid: checkValidity,
        hasUpperCase: checkUpperCase,
        hasLowerCase: checkLowerCase,
        hasNumber: checkNumber,
        hasSpecialChar: checkSpecialChar,
        hasLength: checkLength,
      } = isPasswordValid(password);

      setIsValid(checkValidity);
      setHasUpperCase(checkUpperCase);
      setHasLowerCase(checkLowerCase);
      setHasNumber(checkNumber);
      setHasSpecialChar(checkSpecialChar);
      setHasLength(checkLength);
    }
  }, [password]);

  return {
    isValid,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    hasLength,
  };
};
