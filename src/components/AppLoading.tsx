import AnimatedLogo from './AnimatedLogo';
import Logo from './Logo';
import { Layout } from './SignIn/Layout';
import Spinner from './Spinner';

interface AppLoadingProps {
  animated?: boolean;
}

export const AppLoading: React.FC<AppLoadingProps> = ({ animated }) => {
  return (
    <Layout>
      {animated ? <AnimatedLogo /> : <Logo />}
      <Spinner />
    </Layout>
  );
};

export default AppLoading;
