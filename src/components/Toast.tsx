import { type TFunction } from 'i18next';
import Toast from 'react-native-toast-message';

export const showUnexpectedErrorToast = (t: TFunction<'translation'>) => {
  Toast.show({
    type: 'error',
    text1: t('error.errorTitle'),
    text2: t('error.unexpectedErrorRetry'),
    position: 'bottom',
  });
};
