import { z } from 'zod';

import { i18n } from '../core/i18n/i18n';

const { t } = i18n;

export enum DetectAnomalyFields {
  photo = 'photo',
  description = 'description',
}

export const detectAnomalySchema = z.object({
  [DetectAnomalyFields.photo]: z.string({
    required_error: t('fieldError.photoRequiredError'),
  }),
  [DetectAnomalyFields.description]: z.string({
    required_error: t('fieldError.descriptionRequiredError'),
  }),
});

export type DetectAnomalySchemaType = z.infer<typeof detectAnomalySchema>;
