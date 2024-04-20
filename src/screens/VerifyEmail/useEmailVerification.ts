import { useEffect, useMemo, useState } from 'react';

import {
  ResendRequestStatus,
  VerificationRequestStatus,
  VerificationScreenStatus,
} from './types';

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
        return VerificationScreenStatus.Sending;
      case ResendRequestStatus.Failure:
        return VerificationScreenStatus.Failure;
      case ResendRequestStatus.Sent:
        return VerificationScreenStatus.Success;
      default:
        // If idle it breaks the switch in favour of possible deeplinking
        break;
    }
    if (isDeepLinkedVerificationStage) {
      switch (verificationStatus) {
        case VerificationRequestStatus.Verifying:
          return VerificationScreenStatus.Verifying;
        case VerificationRequestStatus.Failure:
          return VerificationScreenStatus.Failure;
        case VerificationRequestStatus.Verified:
          return VerificationScreenStatus.Success;
        default:
          return;
      }
    }
    return VerificationScreenStatus.Pending;
  }, [verificationStatus, resendStatus, isDeepLinkedVerificationStage]);

  return {
    isDeepLinkedVerificationStage,
    finalStatus,
    displayButtons:
      finalStatus !== VerificationScreenStatus.Sending &&
      finalStatus !== VerificationScreenStatus.Verifying,
  };
};
