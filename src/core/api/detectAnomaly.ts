import { type AnomalyDetectionRequest, APIEndpoints, Methods } from './types';

export const detectAnomaly = (body: AnomalyDetectionRequest) => {
  return {
    url: APIEndpoints.ImageAnalysis,
    method: Methods.POST,
    body,
  };
};
