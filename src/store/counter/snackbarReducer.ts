import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// declaring the types for our state
export type SnackbarState = {
  open: boolean;
  text: string;
  type: 'success' | 'error';
};

const initialState: SnackbarState = {
  open: true,
  text: '',
  type: 'success',
};

interface TSnackbarPayload {
  text: string;
  type: 'success' | 'error';
}

export const counterSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<TSnackbarPayload>) => {
      state.open = true;
      state.text = action.payload.text;
      state.type = action.payload.type;
    },
    close: (state) => {
      state.open = false;
    },
  },
});

export const { open, close } = counterSlice.actions;

export const snackbar = (state: RootState) => state.snackbar;

export default counterSlice.reducer;
