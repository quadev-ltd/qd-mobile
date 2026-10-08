import { createApi } from '@reduxjs/toolkit/query/react';

import { detectAnomaly } from './detectAnomaly';
import {
  type AnomalyDetectionResponse,
  type AnomalyDetectionRequest,
} from './types';

// The old custom backend API is gone (phase 3: Firebase). Only the mocked anomaly detection is
// left here until phase 4 replaces it.

// Create a mock base query that returns the response directly
const mockBaseQuery = () => {
  return new Promise<{ data: AnomalyDetectionResponse }>(resolve =>
    setTimeout(
      () =>
        resolve({
          data: {
            text: `## Description
The photo indicates a visible crack along the valve stem, likely caused by mechanical stress or thermal fatigue. Additionally, the sealing gasket appears to be slightly offset, which could lead to potential contamination or pressure loss.
## Recommended action
- Replace the valve stem immediately to prevent failure during operation.
- Inspect and realign or replace the sealing gasket to ensure a sterile, airtight closure.
- Review recent pressure logs to check for abnormal spikes that may have contributed to the damage.
## Severity
High – may compromise product sterility and process safety.`,
          },
        }),
      3000,
    ),
  );
};

export const anomalyDetectionApiSlice = createApi({
  reducerPath: 'anomalyDetectionApi',
  baseQuery: mockBaseQuery,
  endpoints: builder => ({
    detectAnomaly: builder.mutation<
      AnomalyDetectionResponse,
      AnomalyDetectionRequest
    >({
      query: detectAnomaly,
    }),
  }),
});

export const { useDetectAnomalyMutation } = anomalyDetectionApiSlice;
