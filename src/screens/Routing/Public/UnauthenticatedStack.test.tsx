import { render, waitFor } from '@testing-library/react-native';

import UnauthenticatedStack from './UnauthenticatedStack';

jest.mock('@react-native-firebase/crashlytics', () => ({
  recordError: jest.fn(),
  log: jest.fn(),
}));

describe('UnauthenticatedStack', () => {
  it('should render correctly', async () => {
    const { findByText } = render(
      <UnauthenticatedStack
        environment="test"
        applicationName="Test Application"
      />,
    );

    await waitFor(
      async () => {
        const element = await findByText('landing.signUpButton');
        expect(element).toBeTruthy();
      },
      { timeout: 1000 },
    );
  });
});
