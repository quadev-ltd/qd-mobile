import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

const { t } = i18n;

export enum DetectAnomalyFields {
  image = 'image',
  prompt = 'prompt',
}

export const detectAnomalySchema = z.object({
  [DetectAnomalyFields.image]: z.string({
    required_error: t('fieldError.photoRequiredError'),
  }),
  [DetectAnomalyFields.prompt]: z.string({
    required_error: t('fieldError.descriptionRequiredError'),
  }),
});

export type DetectAnomalySchemaType = z.infer<typeof detectAnomalySchema>;
