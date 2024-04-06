import { createSlice } from '@reduxjs/toolkit';

export interface TestSliceState {
  isOn: boolean;
}

const initialState: TestSliceState = {
  isOn: false,
};

export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    toggle: state => {
      state.isOn = !state.isOn;
    },
  },
});

export const { toggle } = testSlice.actions;
