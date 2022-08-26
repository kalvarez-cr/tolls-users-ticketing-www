import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// declaring the types for our state
export type LoginState = {
  loggedIn: boolean;
};

const initialState: LoginState = {
  loggedIn: false,
};

interface TLoginPayload {
  account_info: {
    nominal_balance: string;
    account_iso_code: string;
    last_use_tag: string;
    last_use_date: string;
    status: boolean;
  };
  role: string;
  build_version: string;
  valid_payment_methods: Array<string>;
  states: {
    id: string;
    name: string;
  }[];
  roles: {
    id: string;
    name: string;
  }[];
  user_info: {
    id: string;
    account_number: string;
    account_holder: string;
    first_name: string;
    last_name: string;
    nif: string;
    phone_number: string;
    address: string;
    email: string;
    status: boolean;
    state: string;
    vehicles: Array<string>;
  };
}

export const counterSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<TLoginPayload>) => {
      return { loggedIn: true, ...action.payload };
    },
    logout: (state) => {
      return { loggedIn: false };
    },
  },
});

export const { login, logout } = counterSlice.actions;

export const loginUser = (state: RootState) => state.loginUser;

export default counterSlice.reducer;
