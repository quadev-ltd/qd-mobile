import { t } from 'i18next';
import { useState } from 'react';
import { Image } from 'react-native';
import { stat } from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

import { processError, type RTKQueryErrorType } from '../errors';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import { useDetectAnomalyMutation } from '@/core/api';
import logger from '@/core/logger';
import {
  DetectAnomalyFields,
  type DetectAnomalySchemaType,
} from '@/schemas/detectAnomalySchema';

export const fitImageToRequest = async (uri: string): Promise<string> => {
  const stats = await stat(uri);
  const size = Number(stats.size);
  const MAX_SIZE_BYTES = 2 * 1024 * 1024;
  if (size <= MAX_SIZE_BYTES) return uri;
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      async (originalWidth, originalHeight) => {
        const maxDim = 1024;
        const aspectRatio = originalWidth / originalHeight;
        let width, height;

        if (originalWidth > originalHeight) {
          width = maxDim;
          height = Math.round(maxDim / aspectRatio);
        } else {
          height = maxDim;
          width = Math.round(maxDim * aspectRatio);
        }

        try {
          const resizedImage = await ImageResizer.createResizedImage(
            uri,
            width,
            height,
            'JPEG',
            70,
          );
          resolve(resizedImage.uri);
        } catch (err) {
          reject(err);
        }
      },
      reject,
    );
  });
};

export const getMimeTypeFromUri = (uri: string): string => {
  if (uri.endsWith('.png')) return 'image/png';
  if (uri.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg'; // default
};

export const getFileNameFromUri = (uri: string) => {
  const parts = uri.split('/');
  return parts[parts.length - 1] || 'image.jpg';
};

export const useDetectAnomaly = () => {
  const [detectAnomaly, { isLoading, isError, isSuccess, reset, data }] =
    useDetectAnomalyMutation();
  const [errorMessageCode, setErrorMessageCode] = useState<
    string | undefined
  >();

  const submitDetectAnomaly = async (values: DetectAnomalySchemaType) => {
    const { image: uri, prompt } = values;
    let fittedSizeImage: string = uri;
    try {
      fittedSizeImage = await fitImageToRequest(uri);
    } catch (compressError) {
      logger().logError(compressError as Error);
      setErrorMessageCode('error.imageCompressionError');
    }
    const formData = new FormData();
    formData.append(DetectAnomalyFields.image, {
      uri: fittedSizeImage,
      name: getFileNameFromUri(fittedSizeImage),
      type: getMimeTypeFromUri(fittedSizeImage),
    });
    formData.append(DetectAnomalyFields.prompt, prompt);
    try {
      await detectAnomaly(formData).unwrap();
    } catch (err) {
      setErrorMessageCode('error.serverSideError');
      processError(err as RTKQueryErrorType, t, {
        onUnmanagedError: unmanagedErrorMessage =>
          showErrorToast(t('error.errorTitle'), unmanagedErrorMessage),
        onUnexpectedError: () => showUnexpectedErrorToast(t),
        logErrorMessage: `Unknown image processing error: ${JSON.stringify(
          err,
        )}`,
      });
    }
  };

  return {
    submitDetectAnomaly,
    isLoading,
    isSuccess,
    isError,
    errorMessageCode,
    reset,
    data,
  };
};
