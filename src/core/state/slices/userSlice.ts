import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { type RootState } from '../store';

import { AccountStatus } from './authSlice';
import { LOGOUT } from './types';

import logger from '@/core/logger';
import { type Timestamp } from '@/util';

export interface User {
  email: string;
  userID: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Timestamp;
  registrationDate: Timestamp;
  accountStatus: string;
}

const initialState: User = {
  email: '',
  userID: '',
  firstName: '',
  lastName: '',
  dateOfBirth: { seconds: 0, nanos: 0 },
  registrationDate: { seconds: 0, nanos: 0 },
  accountStatus: '',
};

const sliceName = 'user';
export const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setProfileDetails: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(LOGOUT, () => {
      logger().logMessage(`${sliceName} slice logout successfully`);
      return initialState;
    });
  },
});

export const { setProfileDetails } = userSlice.actions;

export const isUserVerifiedSelector = (state: RootState) =>
  state.user?.accountStatus === AccountStatus.Verified;
