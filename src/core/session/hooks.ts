import { useAppSelector } from '@/core/state/hooks';
import {
  selectClaims,
  selectSessionStatus,
  selectSessionUser,
} from '@/core/state/selectors/session';

export const useSessionStatus = () => useAppSelector(selectSessionStatus);
export const useSessionUser = () => useAppSelector(selectSessionUser);

/**
 * Whether the user has paid features (the `paid` custom claim). Nothing is gated on it yet;
 * phase 4 uses it.
 */
export const usePaidFeatures = () => useAppSelector(selectClaims).paid;
