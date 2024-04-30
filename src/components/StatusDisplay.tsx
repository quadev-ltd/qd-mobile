import { type ReactNode } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import Spinner from '@/components/Spinner';
import { colors } from '@/styles';

export enum VerificationStatus {
  Pending = 'PENDING',
  Verifying = 'VERIFYING',
  Sending = 'SENDING',
  Failure = 'FAILURE',
  Irreparable = 'IRREPARABLE',
  Success = 'SUCCESS',
}

interface StatusDisplayProps {
  status?: VerificationStatus;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  let AnimateImage: ReactNode = null;
  switch (status) {
    case VerificationStatus.Pending:
      AnimateImage = (
        <Image
          style={styles.heroImage}
          source={require('../assets/gif/mail.gif')}
        />
      );
      break;
    case VerificationStatus.Sending:
      AnimateImage = (
        <Image
          style={styles.heroImage}
          source={require('../assets/gif/sending.gif')}
        />
      );
      break;
    case VerificationStatus.Verifying:
      AnimateImage = <Spinner style={styles.heroImage} color={colors.grey} />;
      break;
    case VerificationStatus.Success:
      AnimateImage = (
        <Image
          style={styles.resultImage}
          source={require('../assets/gif/check.gif')}
        />
      );
      break;
    case VerificationStatus.Failure:
      AnimateImage = (
        <Image
          style={styles.resultImage}
          source={require('../assets/gif/error.gif')}
        />
      );
      break;
    case VerificationStatus.Irreparable:
      AnimateImage = (
        <Image
          style={styles.resultImage}
          source={require('../assets/gif/error.gif')}
        />
      );
      break;
    default:
      AnimateImage = null;
      break;
  }
  return <View style={styles.container}>{AnimateImage}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: -16,
    height: 200,
    position: 'relative',
    alignItems: 'center',
  },
  heroImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 0,
  },
  resultImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 50,
  },
});

export default StatusDisplay;
