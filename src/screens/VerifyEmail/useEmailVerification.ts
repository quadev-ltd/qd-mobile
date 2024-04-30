import { useEffect, useMemo, useState } from 'react';

import { ResendRequestStatus, VerificationRequestStatus } from './types';

import { VerificationStatus } from '@/components/StatusDisplay';

export const useEmailVerification = (
  verificationStatus: VerificationRequestStatus,
  resendStatus: ResendRequestStatus,
) => {
  const [isDeepLinkedVerificationStage, setIsDeepLinkedVerificationStage] =
    useState(false);

  useEffect(() => {
    if (verificationStatus === VerificationRequestStatus.Verifying) {
      setIsDeepLinkedVerificationStage(true);
    }
    if (resendStatus === ResendRequestStatus.Sent) {
      setIsDeepLinkedVerificationStage(false);
    }
  }, [verificationStatus, resendStatus]);

  const finalStatus = useMemo(() => {
    switch (resendStatus) {
      case ResendRequestStatus.Sending:
        return VerificationStatus.Sending;
      case ResendRequestStatus.Failure:
        return VerificationStatus.Failure;
      case ResendRequestStatus.Sent:
        return VerificationStatus.Success;
      default:
        // If idle it breaks the switch in favour of possible deeplinking
        break;
    }
    if (isDeepLinkedVerificationStage) {
      switch (verificationStatus) {
        case VerificationRequestStatus.Verifying:
          return VerificationStatus.Verifying;
        case VerificationRequestStatus.Failure:
          return VerificationStatus.Failure;
        case VerificationRequestStatus.Verified:
          return VerificationStatus.Success;
        default:
          return;
      }
    }
    return VerificationStatus.Pending;
  }, [verificationStatus, resendStatus, isDeepLinkedVerificationStage]);

  return {
    isDeepLinkedVerificationStage,
    finalStatus,
    displayButtons:
      finalStatus !== VerificationStatus.Sending &&
      finalStatus !== VerificationStatus.Verifying,
  };
};
