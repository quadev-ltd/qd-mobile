import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';

import { Screen, type StackParamList } from '../Routing/types';

import { ResendRequestStatus, VerificationRequestStatus } from './types';
import EmailVerificationComponent from './VerifyEmail';

import { useResendEmail } from '@/core/api/hooks/useResendVerificationEmail';
import { useVerifyEmail } from '@/core/api/hooks/useVerifyEmail';

export type VerifyEmailScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.VerifyEmail
>;

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  route: { params },
  navigation,
}) => {
  const {
    isLoading: isVerifying,
    isError: isVerifyError,
    isSuccess: isVerifySuccess,
    apiErrorCode: apiVerifyErrorCode,
  } = useVerifyEmail(params.userID, params.verificationToken);

  const {
    resendEmail,
    isSending,
    isSendSuccess,
    isSendError,
    apiSendErrorCode,
  } = useResendEmail(params.userID);

  const goToSignIn = () => navigation.navigate(Screen.SignIn);

  const resendStatus = useMemo(() => {
    if (isSending) return ResendRequestStatus.Sending;
    if (isSendSuccess) return ResendRequestStatus.Sent;
    if (isSendError) return ResendRequestStatus.Failure;
    return ResendRequestStatus.Idle;
  }, [isSending, isSendSuccess, isSendError]);

  const verificationStatus = useMemo(() => {
    if (isVerifying) return VerificationRequestStatus.Verifying;
    if (isVerifySuccess) return VerificationRequestStatus.Verified;
    if (isVerifyError) return VerificationRequestStatus.Failure;
    return VerificationRequestStatus.Idle;
  }, [isVerifying, isVerifySuccess, isVerifyError]);

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
