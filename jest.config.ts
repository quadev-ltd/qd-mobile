import type { JestConfigWithTsJest } from 'ts-jest';
import { default as tsjPreset } from 'ts-jest/presets';

const jestConfig: JestConfigWithTsJest = {
  ...tsjPreset.defaults,
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: ['<rootDir>/src/**/*.tsx'],
};

// eslint-disable-next-line import/no-default-export
export default jestConfig;
