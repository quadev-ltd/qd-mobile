import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { PublicScreen, type StackParamList } from '../Routing/Public/types';

import { ResendRequestStatus, VerificationRequestStatus } from './types';
import EmailVerificationComponent from './VerifyEmail';

import { useLoadUserProfile } from '@/core/api/hooks/useLoadUserProfile';
import { useResendEmail } from '@/core/api/hooks/useResendVerificationEmail';
import { useVerifyEmail } from '@/core/api/hooks/useVerifyEmail';
import { useAppDispatch, useAppSelector } from '@/core/state/hooks';
import { logout } from '@/core/state/slices/authSlice';

export type VerifyEmailScreenProps = NativeStackScreenProps<
  StackParamList,
  PublicScreen.VerifyEmail
>;

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  route: { params },
  navigation,
}) => {
  const authToken = useAppSelector(state => state.auth.authToken);
  const {
    resendEmail,
    isSending,
    isSendSuccess,
    isSendError,
    apiSendErrorCode,
  } = useResendEmail(params.userID);
  const dispatch = useAppDispatch();
  const {
    isLoading: isVerifying,
    isError: isVerifyError,
    isSuccess: isVerifySuccess,
    apiErrorCode: apiVerifyErrorCode,
  } = useVerifyEmail(params.userID, params.verificationToken);
  const isProfileLoading = useLoadUserProfile(
    authToken,
    undefined,
    isVerifySuccess,
  );

  const goToSignIn = () => {
    dispatch(logout());
    navigation.navigate(PublicScreen.Landing, {});
  };

  const resendStatus = useMemo(() => {
    if (isSending) return ResendRequestStatus.Sending;
    if (isSendSuccess) return ResendRequestStatus.Sent;
    if (isSendError) return ResendRequestStatus.Failure;
    return ResendRequestStatus.Idle;
  }, [isSending, isSendSuccess, isSendError]);

  const verificationStatus = useMemo(() => {
    if (isVerifying) return VerificationRequestStatus.Verifying;
    if (isVerifySuccess && !isProfileLoading)
      return VerificationRequestStatus.Verified;
    if (isVerifyError || isProfileLoading)
      return VerificationRequestStatus.Failure;
    return VerificationRequestStatus.Idle;
  }, [isVerifying, isVerifySuccess, isVerifyError, isProfileLoading]);

  return (
    <EmailVerificationComponent
      resendStatus={resendStatus}
      verificationStatus={verificationStatus}
      userName={params.firstName ? ` ${params.firstName}` : ''}
      applicationName={params.applicationName}
      resendEmail={resendEmail}
      goToSignIn={goToSignIn}
      apiResendError={apiSendErrorCode}
      apiVerificationError={apiVerifyErrorCode}
    />
  );
};

export default VerifyEmailScreen;
