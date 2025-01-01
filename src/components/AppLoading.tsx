import AnimatedLogo from './Logo/IOSAnimatedLogo';
import Logo from './Logo/Logo';
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
