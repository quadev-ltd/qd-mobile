import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import logger from "../logger";

export const handleFirebaseSignInError = (error: unknown) => {
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