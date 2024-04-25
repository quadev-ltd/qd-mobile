import { type TFunction } from 'i18next';
import Toast from 'react-native-toast-message';

export const showUnexpectedErrorToast = (t: TFunction<'translation'>) => {
  Toast.show({
    type: 'error',
    text1: t('toast.errorTitle'),
    text2: t('toast.unexpectedErrorRetry'),
    position: 'bottom',
  });
};
