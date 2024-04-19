import { render, waitFor } from '@testing-library/react-native';

import { Router } from './Router';

jest.mock('@react-native-firebase/crashlytics', () => ({
  recordError: jest.fn(),
  log: jest.fn(),
}));

describe('Router', () => {
  it('should render correctly', async () => {
    const { findByText } = render(
      <Router environment="test" applicationName="Test Application" />,
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
