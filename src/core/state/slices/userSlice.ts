import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AccountStatus, LOGOUT, type UserState } from './types';

import logger from '@/core/logger';

const initialState: UserState = {
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
    setProfileDetails: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    setUserVerified: state => {
      state.accountStatus = AccountStatus.Verified;
    },
  },
  extraReducers: builder => {
    builder.addCase(LOGOUT, () => {
      logger().logMessage(`${sliceName} slice logout successfully`);
      return initialState;
    });
  },
});

export const { setProfileDetails, setUserVerified } = userSlice.actions;
