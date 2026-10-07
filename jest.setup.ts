import '@testing-library/jest-native/extend-expect';
import { type ReactNode } from 'react';

// Environment variables (.env.test) are loaded in jest.config.ts.

// Reanimated 4 runs on react-native-worklets, which needs its JS mock under Jest.
jest.mock('react-native-worklets', () =>
  jest.requireActual('react-native-worklets/src/mock'),
);

// mock i18next - all text in tests will be returned as the translation key
// e.g. <Text>{t('page.title')}</Text> -> <Text>page.title</Text>
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    use: () => ({ init: jest.fn() }),
  }),
}));

jest.mock('i18next', () => ({
  t: (key: string) => key,
  use: () => ({ init: jest.fn() }),
}));

jest.mock('react-native-gesture-handler', () => {
  return {
    Swipeable: jest.fn().mockImplementation(({ children }) => children),
    GestureHandlerRootView: jest
      .fn()
      .mockImplementation(({ children }) => children),
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: ReactNode }) => children,
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
