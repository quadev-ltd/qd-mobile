import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

import logger from '../logger';

import { NO_SURNAME_PROVIDED } from './constants';
import { getFirebaseIdToken } from './firebase';
import { type AuthenticationProfileData } from './types';

export const onAppleSignIn = async (): Promise<
  AuthenticationProfileData | undefined
> => {
  logger().logMessage('Initiating Apple sign in...');
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const { identityToken, nonce, fullName, email } = appleAuthRequestResponse;

  logger().logMessage(
    `Successfully signed in to Apple with user ${JSON.stringify(
      fullName,
    )} ${email}`,
  );

  const { givenName, familyName } = fullName ?? {};

  if (email === null) {
    throw Error(
      `User details missing: ${JSON.stringify({
        familyName,
        givenName,
        email,
      })}`,
    );
  }

  if (!identityToken) {
    throw Error(`Apple identityToken is null for email ${email}`);
  }

  logger().logMessage(
    `Create a Firebase credential with the Apple identity token`,
  );
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  logger().logMessage(`Get firebase ID token`);
  const firebaseIdToken = await getFirebaseIdToken(appleCredential);

  const lastName = familyName ?? NO_SURNAME_PROVIDED;

  return {
    email: email as string,
    firstName: givenName as string,
    lastName,
    idToken: firebaseIdToken as string,
  };
};
