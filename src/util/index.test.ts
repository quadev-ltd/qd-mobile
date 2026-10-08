import { isValidDisplayDate, stringToDate, validateDatePattern } from './index';

describe('stringToDate', () => {
  it('correctly parses a date string', () => {
    const dateStr = '15/04/2021';
    const result = stringToDate(dateStr);
    expect(result).toEqual(new Date(2021, 3, 15));
  });
});

describe('validateDatePattern', () => {
  it('accepts a leap day in a leap year only', () => {
    expect(validateDatePattern('29/02/2024')).toBe(true);
    expect(validateDatePattern('29/02/2023')).toBe(false);
  });
});

describe('isValidDisplayDate', () => {
  it.each(['01/01/2000', '29/02/2024', '31/12/1999'])('accepts %s', date => {
    expect(isValidDisplayDate(date)).toBe(true);
  });

  it.each([
    '1/1/2000',
    '01/01/00',
    '2000-01-01',
    '31/04/2000',
    '01.01.2000',
    '',
  ])('rejects %s', date => {
    expect(isValidDisplayDate(date)).toBe(false);
  });
});
