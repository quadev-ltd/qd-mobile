import Logo from './Logo';
import { Layout } from './SignIn/Layout';
import Spinner from './Spinner';

export const AppLoading: React.FC = () => {
  return (
    <Layout>
      <Logo />
      <Spinner />
    </Layout>
  );
};

export default AppLoading;
