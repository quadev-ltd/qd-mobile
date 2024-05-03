import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import StatusDisplay, {
  type VerificationStatus,
} from '../../components/StatusDisplay';

interface StatusContainerProps {
  status: VerificationStatus;
  children?: ReactNode;
}

const StatusContainer: React.FC<StatusContainerProps> = ({
  status,
  children,
}) => {
  return (
    <View style={styles.statusContainer}>
      <StatusDisplay status={status} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default StatusContainer;
