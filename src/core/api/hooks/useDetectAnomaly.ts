import { useDetectAnomalyMutation } from '@/core/api';
import { type DetectAnomalySchemaType } from '@/schemas/detectAnomalySchema';

export const useDetectAnomaly = () => {
  const [detectAnomaly, { isLoading, isSuccess, reset, data }] =
    useDetectAnomalyMutation();

  const submitDetectAnomaly = async (formData: DetectAnomalySchemaType) => {
    await detectAnomaly(formData);
  };

  return { submitDetectAnomaly, isLoading, isSuccess, reset, data };
};
