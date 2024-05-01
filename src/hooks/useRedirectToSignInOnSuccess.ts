import { useEffect, useRef } from 'react';

const DELAY = 4000;
export const useRedirectToSignInOnSuccess = (
  isSuccess: boolean,
  onSuccessGoToSignIn: () => void,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  useEffect(() => {
    if (isSuccess) {
      timeoutRef.current = setTimeout(() => {
        onSuccessGoToSignIn();
      }, DELAY);
    }
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [isSuccess, onSuccessGoToSignIn]);
};
