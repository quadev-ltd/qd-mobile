import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import AuthenticatedStack from './Private/AuthenticatedStack';
import UnauthenticatedStack from './Public/UnauthenticatedStack';

import { linking } from '@/core/deepLinking';
import { useAppSelector } from '@/core/state/hooks';
import {
  AuthStateStatus,
  authStatusSelector,
} from '@/core/state/slices/authSlice';

type RouterProps = {
  environment?: string;
  applicationName: string;
};

const Router: React.FC<RouterProps> = ({ environment, applicationName }) => {
  const authenticationStatus = useAppSelector(authStatusSelector);
  return (
    <NavigationContainer linking={linking}>
      {authenticationStatus === AuthStateStatus.Authenticated ? (
        <AuthenticatedStack hideSplashScreen={SplashScreen.hide} />
      ) : (
        <UnauthenticatedStack
          hideSplashScreen={SplashScreen.hide}
          environment={environment}
          applicationName={applicationName}
        />
      )}
    </NavigationContainer>
  );
};

export default Router;
