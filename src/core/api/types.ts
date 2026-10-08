// The anomaly-detection API is still mocked (src/core/api/index.ts); it moves to Firebase in phase 4.

export enum AIEndpoints {
  DetectAnomaly = '/detect',
}

export enum Methods {
  POST = 'POST',
}

export type AnomalyDetectionRequest = {
  photo: string;
  description: string;
};

export type AnomalyDetectionResponse = {
  text: string;
};
