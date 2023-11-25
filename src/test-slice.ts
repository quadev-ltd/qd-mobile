import { createSlice } from '@reduxjs/toolkit';

export interface TestSliceState {
  isOn: boolean;
}

const initialState: TestSliceState = {
  isOn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOn = !state.isOn;
    },
  },
});

export default authSlice.reducer;

export const { toggle } = authSlice.actions;