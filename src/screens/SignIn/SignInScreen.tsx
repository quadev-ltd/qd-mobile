import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import LoadUserProfile from './LoadUserProfile';
import { SignInForm } from './SignInForm';

import { SSOAnimatedForm } from '@/components/SignIn/SSOAnimatedForm';
import { ScreenType } from '@/components/SignIn/types';
import { showUnexpectedErrorToast } from '@/components/Toast';
import { type GetUserProfileResponse } from '@/core/api/types';
import logger from '@/core/logger';
import { useAppDispatch, useAppSelector } from '@/core/state/hooks';
import {
  AccountStatus,
  type TokensPayload,
  login,
  logout,
  setAuthToken,
} from '@/core/state/slices/authSlice';
import { ClaimName } from '@/core/state/slices/types';
import { setProfileDetails } from '@/core/state/slices/userSlice';
import { jwtDecode } from '@/core/state/slices/util';

export type SignInScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.SignIn
>;

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const authToken = useAppSelector(state => state.auth.authToken);
  const { t } = useTranslation();
  const [tokens, setTokens] = useState<TokensPayload | null>(null);

  const handleForgotPassword = () =>
    navigation.navigate(PublicScreen.ForgotPassword);

  const goToSignUp = () => navigation.navigate(PublicScreen.SignUp);

  const handleFacebookLogin = () => {};
  const handleGoogleLogin = () => {};

  const handleLoginSuccess = (authenticationTokens: TokensPayload) => {
    try {
      const claims = jwtDecode(authenticationTokens.authToken);
      setTokens(authenticationTokens);
      dispatch(
        setAuthToken({
          authToken: authenticationTokens.authToken,
          tokenExpiry: new Date(claims[ClaimName.ExpiryClaim] * 1000),
        }),
      );
    } catch (err) {
      logger().logError(Error(`Failed to decode JWT: ${err}`));
      showUnexpectedErrorToast(t);
    }
  };

  const handleLoadProfileSuccess = (data: GetUserProfileResponse) => {
    if (data.user.accountStatus === AccountStatus.Verified) {
      if (tokens === null) {
        dispatch(logout());
        logger().logError(Error('Tokens must not be null at this stage.'));
        showUnexpectedErrorToast(t);
        return;
      }
      dispatch(
        login({
          authToken: tokens.authToken,
          refreshToken: tokens.refreshToken,
        }),
      );
    }
    dispatch(setProfileDetails(data.user));
    if (data.user.accountStatus === AccountStatus.Unverified) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: PublicScreen.VerifyEmail,
            params: {
              firstName: data.user.firstName,
              userID: data.user.userID,
            },
          },
        ],
      });
      return;
    }
    !(
      data.user.accountStatus === AccountStatus.Verified ||
      data.user.accountStatus === AccountStatus.Unverified
    ) &&
      logger().logError(
        Error(`Unknown account status ${data.user.accountStatus}`),
      );
  };
  const handleLoadProfileError = () => {
    dispatch(logout());
  };
  if (authToken) {
    return (
      <LoadUserProfile
        onSuccess={handleLoadProfileSuccess}
        onError={handleLoadProfileError}
      />
    );
  }
  return (
    <SSOAnimatedForm
      screen={ScreenType.SignIn}
      handleFacebookAction={handleFacebookLogin}
      handleGoogleAction={handleGoogleLogin}
      changePath={goToSignUp}
      formHeight={350}>
      <SignInForm
        onSuccess={handleLoginSuccess}
        forgotPasswordCallback={handleForgotPassword}
      />
    </SSOAnimatedForm>
  );
};

export default SignInScreen;
