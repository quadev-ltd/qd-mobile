import { t } from 'i18next';
import { useState } from 'react';
import { Image } from 'react-native';
import { stat, readFile } from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

import { processError, type RTKQueryErrorType } from '../errors';

import { showErrorToast, showUnexpectedErrorToast } from '@/components/Toast';
import { useDetectAnomalyMutation } from '@/core/api';
import logger from '@/core/logger';
import {
  DetectAnomalyFields,
  type DetectAnomalySchemaType,
} from '@/schemas/detectAnomalySchema';

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
export const fitImageToRequest = async (uri: string): Promise<string> => {
  const stats = await stat(uri);
  const size = Number(stats.size);
  if (size <= MAX_SIZE_BYTES) {
    return uri;
  }

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
      error => {
        reject(error);
      },
    );
  });
};

export const getMimeTypeFromUri = (uri: string): string => {
  if (uri.endsWith('.png')) return 'image/png';
  if (uri.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

export const getFileNameFromUri = (uri: string) => {
  const parts = uri.split('/');
  return parts[parts.length - 1] || 'image.jpg';
};

export const createBase64File = async (
  uri: string,
  mimeType: string,
): Promise<{ data: string; name: string; type: string }> => {
  const base64Data = await readFile(uri, 'base64');
  const fileName = getFileNameFromUri(uri);

  return {
    data: base64Data,
    name: fileName,
    type: mimeType,
  };
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
      return;
    }

    const formData = new FormData();
    const mimeType = getMimeTypeFromUri(fittedSizeImage);
    let base64File: { data: string; name: string; type: string } | undefined;
    try {
      base64File = await createBase64File(fittedSizeImage, mimeType);
    } catch (b64FileCreationError) {
      logger().logError(b64FileCreationError as Error);
      setErrorMessageCode('error.imageEncodingError');
      return;
    }
    if (!base64File) {
      logger().logError(new Error('base64File is undefined'));
      setErrorMessageCode('error.imageEncodingError');
      return;
    }

    const fileObject = {
      uri: `data:${mimeType};base64,${base64File.data}`,
      name: base64File.name,
      type: mimeType,
    };
    formData.append(DetectAnomalyFields.image, fileObject as any);
    formData.append(DetectAnomalyFields.prompt, prompt);

    try {
      const response = await detectAnomaly(formData).unwrap();
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
