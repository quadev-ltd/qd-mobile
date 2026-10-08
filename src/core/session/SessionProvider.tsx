import { type ReactNode, useEffect } from 'react';

import {
  getCurrentSessionUser,
  subscribeToAuthState,
} from '@/core/firebase/auth';
import { getClaims } from '@/core/firebase/claims';
import { logFirebaseError } from '@/core/firebase/errors';
import { watchProfile } from '@/core/firebase/profile';
import { type SessionUser } from '@/core/firebase/types';
import { useAppDispatch } from '@/core/state/hooks';
import {
  authStateChanged,
  claimsChanged,
  profileFailed,
  profileLoaded,
} from '@/core/state/slices/sessionSlice';

/**
 * Keeps the `session` slice in sync with Firebase: the signed-in user (onAuthStateChanged), their
 * profile document (onSnapshot) and their custom claims. Mount it once, inside the Redux Provider.
 */
export const SessionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let currentUid: string | null = null;
    let stopWatchingProfile: (() => void) | undefined;
    let stopListening: (() => void) | undefined;

    const onUser = (user: SessionUser | null) => {
      const uid = user?.uid ?? null;
      const userChanged = uid !== currentUid;
      if (userChanged) {
        stopWatchingProfile?.();
        stopWatchingProfile = undefined;
        currentUid = uid;
      }
      dispatch(authStateChanged(user));
      if (!user || !userChanged) {
        return;
      }
      stopWatchingProfile = watchProfile(
        user.uid,
        profile => dispatch(profileLoaded(profile)),
        () => {
          // A listener error after sign-out (permission denied) is expected; ignore it.
          if (getCurrentSessionUser()?.uid === user.uid) {
            dispatch(profileFailed());
          }
        },
      );
      getClaims()
        .then(claims => dispatch(claimsChanged(claims)))
        .catch(error => logFirebaseError('getClaims', error, user.uid));
    };

    try {
      stopListening = subscribeToAuthState(onUser);
    } catch (error) {
      // Never leave the app on the splash screen: show the signed-out screens instead.
      logFirebaseError('subscribeToAuthState', error);
      dispatch(authStateChanged(null));
    }

    return () => {
      stopListening?.();
      stopWatchingProfile?.();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default SessionProvider;
