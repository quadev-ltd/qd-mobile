import { Layout } from './SignIn/Layout';
import Spinner from './Spinner';

export const AppLoading: React.FC = () => {
  return (
    <Layout>
      <Spinner />
    </Layout>
  );
};

export default AppLoading;
