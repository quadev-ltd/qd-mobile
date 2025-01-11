import { NavigationContainer } from '@react-navigation/native';
import { hide } from 'react-native-bootsplash';

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

const hideSplashScreen = () => hide({ fade: true });

const Router: React.FC<RouterProps> = ({ environment, applicationName }) => {
  const isAuthenticated = useAppSelector(isAuthenticatedSelector);
  const isLoading = useAppSelector(isAuthPendingSelector);
  if (isLoading) {
    // This is for when the app loads and authentication needs to bee verified
    return <AppLoading />;
  }
  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? (
        <AuthenticatedStack hideSplashScreen={hideSplashScreen} />
      ) : (
        <UnauthenticatedStack
          hideSplashScreen={hideSplashScreen}
          environment={environment}
          applicationName={applicationName}
        />
      )}
    </NavigationContainer>
  );
};

export default Router;
