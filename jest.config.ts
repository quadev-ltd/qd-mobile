import { config as loadEnv } from 'dotenv';
import type { Config } from 'jest';

// Test configuration (EXPO_PUBLIC_* keys), loaded before any test file is transformed or run.
loadEnv({ path: '.env.test' });

const jestConfig: Config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-paper|@react-native-firebase|@react-native-vector-icons|react-redux)',
  ],
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: ['<rootDir>/src/**/*.tsx'],
};

export default jestConfig;
