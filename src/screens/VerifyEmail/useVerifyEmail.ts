import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import {
  refreshUser,
  sendVerificationEmail,
  signOut,
} from '@/core/firebase/auth';
import { getClaims } from '@/core/firebase/claims';
import {
  AuthErrorCode,
  getErrorCode,
  getErrorMessageKey,
  logFirebaseError,
} from '@/core/firebase/errors';
import { useAppDispatch } from '@/core/state/hooks';
import {
  authStateChanged,
  claimsChanged,
} from '@/core/state/slices/sessionSlice';

export const RESEND_COOLDOWN_SECONDS = 60;

export type ResendStatus = 'idle' | 'sending' | 'sent' | 'error';

/**
 * VerifyEmail logic. The link in the email opens Firebase's hosted page; back in the app the
 * user taps "I've verified" (or simply returns to the app) and `refreshUser` picks up the change.
 * The session then moves on by itself.
 */
export const useVerifyEmail = () => {
  const dispatch = useAppDispatch();
  const [isChecking, setIsChecking] = useState(false);
  const [notVerifiedYet, setNotVerifiedYet] = useState(false);
  const [resendStatus, setResendStatus] = useState<ResendStatus>('idle');
  const [errorKey, setErrorKey] = useState<string | undefined>();
  const [cooldown, setCooldown] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setTimeout(() => setCooldown(value => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const checkVerification = useCallback(
    async (manual: boolean) => {
      if (manual) {
        setIsChecking(true);
        setErrorKey(undefined);
        setNotVerifiedYet(false);
      }
      try {
        const user = await refreshUser();
        if (user) {
          dispatch(authStateChanged(user));
          if (user.emailVerified) {
            getClaims()
              .then(claims => dispatch(claimsChanged(claims)))
              .catch(error => logFirebaseError('getClaims', error, user.uid));
          } else if (manual && isMounted.current) {
            setNotVerifiedYet(true);
          }
        }
      } catch (error) {
        logFirebaseError('refreshUser', error);
        if (manual && isMounted.current) {
          setErrorKey(getErrorMessageKey(error));
        }
      } finally {
        if (manual && isMounted.current) {
          setIsChecking(false);
        }
      }
    },
    [dispatch],
  );

  // Coming back from the mail app or the browser: check without asking.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkVerification(false);
      }
    });
    return () => subscription.remove();
  }, [checkVerification]);

  const resendEmail = useCallback(async () => {
    if (cooldown > 0 || resendStatus === 'sending') {
      return;
    }
    setResendStatus('sending');
    setErrorKey(undefined);
    setNotVerifiedYet(false);
    try {
      await sendVerificationEmail();
      setResendStatus('sent');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      logFirebaseError('sendVerificationEmail', error);
      setResendStatus('error');
      setErrorKey(getErrorMessageKey(error));
      if (getErrorCode(error) === AuthErrorCode.TooManyRequests) {
        setCooldown(RESEND_COOLDOWN_SECONDS);
      }
    }
  }, [cooldown, resendStatus]);

  const switchAccount = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      logFirebaseError('signOut', error);
    }
  }, []);

  return {
    isChecking,
    notVerifiedYet,
    resendStatus,
    errorKey,
    cooldown,
    checkVerification: () => checkVerification(true),
    resendEmail,
    switchAccount,
  };
};
