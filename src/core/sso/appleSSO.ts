import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

import logger from '../logger';

import { getFirebaseIdToken } from './firebase';
import { type AuthenticationProfileData } from './types';

export const onAppleSignIn = async (): Promise<
  AuthenticationProfileData | undefined
> => {
  // Perform the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const { identityToken, nonce, fullName, email } = appleAuthRequestResponse;

  const { givenName, familyName } = fullName ?? {};

  if (identityToken) {
    // Create a Firebase credential with the identity token and nonce
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign in with the credential
    const firebaseIdToken = await getFirebaseIdToken(appleCredential);

    return {
      email: email as string,
      firstName: givenName as string,
      lastName: familyName as string,
      idToken: firebaseIdToken as string,
    };
  } else {
    logger().logError(
      new Error(
        `Apple sign in response does not contain identity token. Email: ${email}. Nonce ${nonce}`,
      ),
    );
  }
};
