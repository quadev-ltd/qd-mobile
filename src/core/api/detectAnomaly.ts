import { AIEndpoints, type AnomalyDetectionRequest, Methods } from './types';

export const detectAnomaly = (body: AnomalyDetectionRequest) => ({
  url: AIEndpoints.DetectAnomaly,
  method: Methods.POST,
  body,
});
