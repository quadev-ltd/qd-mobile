import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { hide } from 'react-native-bootsplash';

import { OnboardingStack } from './Onboarding/OnboardingStack';
import { OnboardingScreen } from './Onboarding/types';
import AuthenticatedStack from './Private/AuthenticatedStack';
import UnauthenticatedStack from './Public/UnauthenticatedStack';

import AppLoading from '@/components/AppLoading';
import { linking } from '@/core/deepLinking';
import { useSessionStatus } from '@/core/session/hooks';
import { useAppSelector } from '@/core/state/hooks';
import { SessionStatus } from '@/core/state/slices/sessionSlice';

type RouterProps = {
  environment?: string;
  applicationName: string;
};

const Router: React.FC<RouterProps> = ({ environment, applicationName }) => {
  const status = useSessionStatus();
  const authResolved = useAppSelector(state => state.session.authResolved);

  // The splash screen hides as soon as Firebase has reported the session, whatever the answer;
  // a profile that is still loading shows the in-app loading screen instead of the splash.
  useEffect(() => {
    if (authResolved) {
      hide({ fade: true }).catch(() => undefined);
    }
  }, [authResolved]);

  if (status === SessionStatus.Initializing) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer linking={linking}>
      {status === SessionStatus.Ready && <AuthenticatedStack />}
      {status === SessionStatus.SignedOut && (
        <UnauthenticatedStack environment={environment} />
      )}
      {(status === SessionStatus.NeedsEmailVerification ||
        status === SessionStatus.NeedsProfile) && (
        <OnboardingStack
          step={
            status === SessionStatus.NeedsEmailVerification
              ? OnboardingScreen.VerifyEmail
              : OnboardingScreen.CompleteProfile
          }
          applicationName={applicationName}
        />
      )}
    </NavigationContainer>
  );
};

export default Router;
