import { useTranslation } from 'react-i18next';

import { Layout } from '@/components/Layout';
import { Section } from '@/components/Section';

interface LandingScreenProps {
  environment?: string;
}
export const LandingScreen = ({ environment }: LandingScreenProps) => {
  const { t } = useTranslation();
  return (
    <Layout>
      <Section
        title={t('landing.title')}
        description={t('landing.description')}
      />
      <Section title={t('landing.environment')} description={environment} />
    </Layout>
  );
};
