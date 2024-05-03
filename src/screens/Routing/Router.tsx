import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import AuthenticatedStack from './Private/AuthenticatedStack';
import UnauthenticatedStack from './Public/UnauthenticatedStack';

import AppLoading from '@/components/AppLoading';
import { linking } from '@/core/deepLinking';
import { useAppSelector } from '@/core/state/hooks';
import {
  isAuthenticatedSelector,
  isAuthPendingSelector,
} from '@/core/state/selectors/auth';

type RouterProps = {
  environment?: string;
  applicationName: string;
};

const Router: React.FC<RouterProps> = ({ environment, applicationName }) => {
  const isAuthenticated = useAppSelector(isAuthenticatedSelector);
  const isLoading = useAppSelector(isAuthPendingSelector);
  if (isLoading) {
    return <AppLoading />;
  }
  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? (
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
