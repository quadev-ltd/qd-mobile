import {
  type TypedUseSelectorHook,
  useDispatch, // eslint-disable-line no-restricted-imports
  useSelector, // eslint-disable-line no-restricted-imports
} from 'react-redux';

import { type AppDispatch, type RootState } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
