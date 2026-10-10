/* eslint-disable @typescript-eslint/no-var-requires, react/display-name -- jest.mock factories cannot use imports */
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';

import AuthenticatedStack from './AuthenticatedStack';

import { useFlag } from '@/core/flags/FlagsProvider';
import { SessionStatus } from '@/core/state/slices/sessionSlice';
import { getMockStore } from '@/util/mockStore';

// The drawer needs the real gesture handler and the full safe-area API, not the minimal mocks from
// jest.setup.ts.
jest.mock('react-native-gesture-handler', () => {
  require('react-native-gesture-handler/jestSetup');
  return jest.requireActual('react-native-gesture-handler');
});
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
jest.mock('@/core/flags/FlagsProvider', () => ({ useFlag: jest.fn() }));
jest.mock('@/core/firebase/auth', () => ({ signOut: jest.fn() }));
jest.mock('@/screens/Home/HomeScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>home screen</Text>;
});
jest.mock('@/screens/DetectAnomalies/DetectAnomaliesScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>smart inspection screen</Text>;
});
jest.mock('@/screens/DeleteAccount/DeleteAccountScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>delete account screen</Text>;
});

// The closed drawer is hidden from accessibility, so its items need includeHiddenElements.
const hidden = { includeHiddenElements: true };

const renderStack = (smartInspection: boolean) => {
  (useFlag as jest.Mock).mockImplementation(
    key => key === 'smartInspection' && smartInspection,
  );
  return render(
    <Provider store={getMockStore({ status: SessionStatus.Ready })}>
      <NavigationContainer>
        <AuthenticatedStack />
      </NavigationContainer>
    </Provider>,
  );
};

describe('AuthenticatedStack', () => {
  beforeEach(() => jest.clearAllMocks());

  it('hides Smart inspection (drawer item and route) when the flag is off', () => {
    renderStack(false);
    expect(useFlag).toHaveBeenCalledWith('smartInspection');
    expect(screen.getByText('home screen')).toBeOnTheScreen();
    expect(screen.queryByText('Smart inspection', hidden)).toBeNull();
    // The other drawer items are still there.
    expect(screen.getByText('Home', hidden)).toBeTruthy();
  });

  it('shows the Smart inspection drawer item when the flag is on', () => {
    renderStack(true);
    expect(screen.getByText('home screen')).toBeOnTheScreen();
    expect(screen.getByText('Smart inspection', hidden)).toBeTruthy();
    expect(screen.getByText('Home', hidden)).toBeTruthy();
  });
});
