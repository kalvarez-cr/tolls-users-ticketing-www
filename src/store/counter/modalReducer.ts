import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// declaring the types for our state
export type modalState = {
  open: boolean;
};

const initialState: modalState = {
  open: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state) => {
      state.open = true;
    },
    close: (state) => {
      state.open = false;
    },
  },
});

export const { open, close } = modalSlice.actions;

export const modal = (state: RootState) => state.modal;

export default modalSlice.reducer;
