import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { type Screen, type StackParamList } from '../Routing/types';

import { Layout } from '@/components/SignIn/Layout';

export type VerifyEmailScreenProps = NativeStackScreenProps<
  StackParamList,
  Screen.VerifyEmail
>;

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  route,
}) => {
  return (
    <Layout>
      <Text>Verify Email Screen</Text>
      <Text>{route.params?.userID}</Text>
      <Text>{route.params?.verificationToken}</Text>
    </Layout>
  );
};

export default VerifyEmailScreen;
