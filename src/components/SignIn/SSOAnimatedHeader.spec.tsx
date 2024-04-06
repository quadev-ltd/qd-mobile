import { render } from '@testing-library/react-native';

import { SSOAnimatedHeader } from './SSOAnimatedHeader';
import { ScreenType } from './types';

describe('SSOAnimatedHeader', () => {
  const switchSSO = jest.fn();
  const handleFacebookLogin = jest.fn();
  const handleGoogleLogin = jest.fn();
  it('renders initial state correctly', () => {
    const { getByText, queryByText } = render(
      <SSOAnimatedHeader
        screen={ScreenType.SignIn}
        isSSOExpanded={true}
        disableAnimation={true}
        switchSSO={switchSSO}
        handleFacebookLogin={handleFacebookLogin}
        handleGoogleLogin={handleGoogleLogin}
      />,
    );
    expect(getByText('signIn.withGoogle')).toBeTruthy();
    expect(getByText('signIn.withFacebook')).toBeTruthy();
    expect(queryByText('signIn.withSSO')).toBeNull();
  });
});
