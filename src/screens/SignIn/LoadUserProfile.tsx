import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

import AppLoading from '@/components/AppLoading';
import { showUnexpectedErrorToast } from '@/components/Toast';
import { useGetUserProfileQuery } from '@/core/api';
import { type GetUserProfileResponse } from '@/core/api/types';
import logger from '@/core/logger';

interface LoadUserProfileProps {
  onSuccess: (data: GetUserProfileResponse) => void;
  onError: () => void;
}

export const LoadUserProfile: React.FC<LoadUserProfileProps> = ({
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation();

  const { data, isSuccess, isError } = useGetUserProfileQuery(undefined);

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        onSuccess(data);
        return;
      } else {
        logger().logError(Error('Profile response is empty'));
        showUnexpectedErrorToast(t);
        onError();
      }
    }
    if (isError) {
      logger().logError(Error('Failed to get user profile'));
      Toast.show({
        type: 'error',
        text1: t('signIn.getProfileError'),
        text2: t('signIn.getProfileErrorDescription'),
        position: 'bottom',
      });
      onError();
    }
  }, [isSuccess, isError, data, onError, onSuccess, t]);

  return <AppLoading />;
};

export default LoadUserProfile;
