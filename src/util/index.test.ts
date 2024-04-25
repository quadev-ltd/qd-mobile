import { stringToDate, stringToGrpcTimestamp, trimFormData } from '.';

describe('stringToGrpcTimestamp', () => {
  it('converts a valid date string to a gRPC Timestamp', () => {
    const date = '15/04/2021';
    const result = stringToGrpcTimestamp(date);
    const expectedSeconds = new Date(2021, 3, 15).getTime() / 1000;
    expect(result.seconds).toBe(expectedSeconds);
    expect(result.nanos).toBe(0);
  });

  it('throws an error for invalid date formats', () => {
    const date = '2021-04-15'; // Incorrect format
    expect(() => stringToGrpcTimestamp(date)).toThrow('Invalid date format');
  });

  it('has to be a date with no fractions', () => {
    const dateString = `15/04/2021:00:00:00.123`;
    expect(() => stringToGrpcTimestamp(dateString)).toThrow(
      'Invalid date format',
    );
  });
});

describe('stringToDate', () => {
  it('correctly parses a date string', () => {
    const dateStr = '15/04/2021';
    const result = stringToDate(dateStr);
    expect(result).toEqual(new Date(2021, 3, 15));
  });
});

describe('trimFormData', () => {
  it('trims string values in the object', () => {
    const input = {
      name: ' John Doe ',
      email: ' john.doe@example.com  ',
    };
    const expected = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };
    expect(trimFormData(input)).toEqual(expected);
  });

  it('does not alter number values', () => {
    const input = {
      age: 30,
      weight: ' 75 kg ',
    };
    const expected = {
      age: 30,
      weight: '75 kg',
    };
    expect(trimFormData(input)).toEqual(expected);
  });

  it('does not alter complex types like Timestamp', () => {
    const input = {
      timestamp: { seconds: 1620000000, nanos: 500000000 },
      comment: '  Great service!  ',
    };
    const expected = {
      timestamp: { seconds: 1620000000, nanos: 500000000 },
      comment: 'Great service!',
    };
    expect(trimFormData(input)).toEqual(expected);
  });

  it('correctly handles empty objects', () => {
    const input = {};
    const expected = {};
    expect(trimFormData(input)).toEqual(expected);
  });

  it('handles strings that are only whitespace', () => {
    const input = {
      description: '   ',
      notes: 'Note with spaces   ',
    };
    const expected = {
      description: '',
      notes: 'Note with spaces',
    };
    expect(trimFormData(input)).toEqual(expected);
  });
});
