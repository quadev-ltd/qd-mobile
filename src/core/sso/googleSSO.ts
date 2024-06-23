import auth, { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

import { env } from '../env';
import logger from '../logger';

GoogleSignin.configure({
  webClientId: env.CLIENT_ID,
  offlineAccess: true,
});

const hasCodeProperty = (error: unknown): error is { code: unknown } => {
  return (error as { code: unknown }).code !== undefined;
};

const handleFirebaseSignInError = (error: unknown) => {
  const firebaseAuthError = error as FirebaseAuthTypes.NativeFirebaseAuthError;
  if (firebaseAuthError.code) {
    // Handle Firebase Auth Errors
    switch (firebaseAuthError.code) {
      case 'auth/network-request-failed':
        logger().logError(
          new Error(
            `Network request failed. Check your connection and try again. ${JSON.stringify(
              error,
            )}`,
          ),
        );
        break;
      case 'auth/user-disabled':
        logger().logError(
          new Error(`User account is disabled. ${JSON.stringify(error)}`),
        );
        break;
      case 'auth/user-not-found':
        logger().logError(
          new Error(`User not found. ${JSON.stringify(error)}`),
        );
        break;
      case 'auth/invalid-credential':
        logger().logError(
          new Error(
            `Invalid credentials. Please try again. ${JSON.stringify(error)}`,
          ),
        );
        break;
      case 'auth/operation-not-allowed':
        logger().logError(
          new Error(
            `Operation not allowed. Please enable Google sign-in in Firebase. ${JSON.stringify(
              error,
            )}`,
          ),
        );
        break;
      default:
        logger().logError(error as Error);
        break;
    }
  } else {
    logger().logError(error as Error);
  }
};

const getFirebaseIdToken = async (
  googleIdToken: string,
): Promise<string | undefined> => {
  try {
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(googleIdToken);

    // Sign-in the user with the credential
    const userCredential = await auth().signInWithCredential(googleCredential);

    // Get the Firebase ID token
    const firebaseIdToken = await userCredential.user.getIdToken();

    return firebaseIdToken;
  } catch (error) {
    handleFirebaseSignInError(error);
    throw error;
  }
};

export interface GoogleProfileData {
  email: string;
  firstName: string;
  lastName: string;
  idToken: string;
}

export const onGoogleSignIn = async (): Promise<
  GoogleProfileData | undefined
> => {
  try {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    if (!hasPlayServices) {
      Alert.alert(
        'Google Play Services Not Available',
        'Google Play Services is required for Google Sign-In. Please install/update Google Play Services and try again.',
      );
      return;
    }
    const {
      idToken,
      user: { familyName, givenName, email },
    } = await GoogleSignin.signIn();

    if (familyName === null || givenName === null || email === null) {
      throw Error(
        `User details missing: ${JSON.stringify({
          familyName,
          givenName,
          email,
        })}`,
      );
    }

    if (idToken === null) {
      throw Error(`Google idToken is null for email ${email}`);
    }

    // Get the Firebase ID token
    const firebaseIdToken = await getFirebaseIdToken(idToken);

    // return user data
    return {
      email,
      firstName: givenName as string,
      lastName: familyName as string,
      idToken: firebaseIdToken as string,
    };
  } catch (error) {
    if (hasCodeProperty(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // user cancelled the login flow
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // play services not available or outdated
          break;
        default:
          throw error;
      }
    } else {
      throw error;
    }
  }
};
