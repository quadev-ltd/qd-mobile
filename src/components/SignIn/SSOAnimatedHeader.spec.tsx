import { render } from '@testing-library/react-native';

import { SSOAnimatedHeader } from './SSOAnimatedHeader';
import { ScreenType } from './types';

jest.mock(
  'react-native-vector-icons/MaterialCommunityIcons',
  () => 'MaterialCommunityIcons',
);

describe('SSOAnimatedHeader', () => {
  const switchSSO = jest.fn();
  const handleFacebookSignIn = jest.fn();
  const handleGoogleSignIn = jest.fn();
  it('renders initial state correctly', () => {
    const { getByText, queryByText } = render(
      <SSOAnimatedHeader
        screen={ScreenType.SignIn}
        isSSOExpanded={true}
        disableAnimation={true}
        switchSSO={switchSSO}
        handleFacebookSignIn={handleFacebookSignIn}
        handleGoogleSignIn={handleGoogleSignIn}
        safeAreaViewportHeight={900}
      />,
    );
    expect(getByText('signIn.withGoogle')).toBeTruthy();
    expect(getByText('signIn.withFacebook')).toBeTruthy();
    expect(queryByText('signIn.withSSO')).toBeNull();
  });
});
