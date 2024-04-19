import { Image, StyleSheet } from 'react-native';

import { VerificationScreenStatus } from './types';

import Spinner from '@/components/Spinner';
import { colors } from '@/styles';

interface StatusDisplayProps {
  status?: VerificationScreenStatus;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  switch (status) {
    case VerificationScreenStatus.Pending:
      return (
        <Image
          style={styles.heroImage}
          source={require('../../assets/gif/mail.gif')}
        />
      );
    case VerificationScreenStatus.Sending:
      return (
        <Image
          style={styles.heroImage}
          source={require('../../assets/gif/sending.gif')}
        />
      );
    case VerificationScreenStatus.Verifying:
      return <Spinner style={styles.heroImage} color={colors.grey} />;
    case VerificationScreenStatus.Success:
      return (
        <Image
          style={styles.resultImage}
          source={require('../../assets/gif/check.gif')}
        />
      );
    case VerificationScreenStatus.Failure:
      return (
        <Image
          style={styles.resultImage}
          source={require('../../assets/gif/error.gif')}
        />
      );
    case VerificationScreenStatus.Irreparable:
      return (
        <Image
          style={styles.resultImage}
          source={require('../../assets/gif/error.gif')}
        />
      );
    default:
      return;
  }
};

const styles = StyleSheet.create({
  heroImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    top: 100,
  },
  resultImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 150,
  },
});

export default StatusDisplay;
