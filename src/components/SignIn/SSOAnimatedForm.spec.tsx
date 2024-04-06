import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { type ReactTestInstance } from 'react-test-renderer';

import { SSOAnimatedForm } from './SSOAnimatedForm';
import { ScreenType } from './types';

describe('SSOAnimatedForm', () => {
  const handleFacebookSignIn = jest.fn();
  const handleGoogleSignIn = jest.fn();
  const goToSignUp = jest.fn();

  beforeEach(() => {
    handleFacebookSignIn.mockReset();
    handleGoogleSignIn.mockReset();
    goToSignUp.mockReset();
  });

  it('hides single sign on call to action buttons and shows the form', async () => {
    const { findByTestId, getByTestId, queryByTestId, getByText, queryByText } =
      render(
        <SSOAnimatedForm
          screen={ScreenType.SignIn}
          handleFacebookAction={handleFacebookSignIn}
          handleGoogleAction={handleGoogleSignIn}
          changePath={goToSignUp}
          formHeight={0}
        />,
      );
    jest.useFakeTimers();

    await act(() => {
      fireEvent.press(getByText('signIn.withEmail'));
      jest.runAllTimers();
    });

    const googleCTA = getByTestId('google-cta');
    expect(googleCTA.props.style.opacity).toBe(1);
    const facebookCTA = getByTestId('facebook-cta');
    expect(facebookCTA.props.style.opacity).toBe(1);
    const emailCTA: ReactTestInstance | null = getByTestId('email-cta');
    expect(emailCTA.props.style.opacity).toBe(1);
    let form = getByTestId('form');
    expect(form.props.style.opacity).toBe(0);
    const formPosition = form.props.style.transform[0].translateY;

    await waitFor(
      async () => {
        expect(queryByText('signIn.withEmail')).toBeNull();
        form = await findByTestId('form');
        expect(form.props.style.opacity).toBe(1);
        expect(form.props.style.transform[0].translateY).toBeLessThan(
          formPosition,
        );
        expect(queryByTestId('google-cta')).toBeNull();
        expect(queryByTestId('facebook-cta')).toBeNull();
      },
      { timeout: 3000 },
    );
  });
});
