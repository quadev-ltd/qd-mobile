import { type TFunction } from 'i18next';
import Toast from 'react-native-toast-message';

export const showErrorToast = (title: string, message: string) => {
  Toast.show({
    type: 'error',
    text1: title,
    text2: message,
    position: 'bottom',
  });
};

export const showInfoToast = (title: string, message: string) => {
  Toast.show({
    type: 'info',
    text1: title,
    text2: message,
    position: 'bottom',
  });
};

export const showUnexpectedErrorToast = (t: TFunction<'translation'>) => {
  Toast.show({
    type: 'error',
    text1: t('error.errorTitle'),
    text2: t('error.unexpectedErrorRetry'),
    position: 'bottom',
  });
};
