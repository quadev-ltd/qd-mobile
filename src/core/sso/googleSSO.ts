import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';

import { env } from '../env';

import { getFirebaseIdToken } from './firebase';
import { type FirebaseProfileData } from './types';

GoogleSignin.configure({
  webClientId: env.CLIENT_ID,
  offlineAccess: true,
});

const hasCodeProperty = (error: unknown): error is { code: unknown } => {
  return (error as { code: unknown }).code !== undefined;
};

export const onGoogleSignIn = async (): Promise<
  FirebaseProfileData | undefined
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

    // Create a Firebase credential with the Google ID token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Get the Firebase ID token
    const firebaseIdToken = await getFirebaseIdToken(googleCredential);

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
