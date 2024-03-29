import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// declaring the types for our state
export type LoginState = {
  loggedIn: boolean;
  user_info?: TLoginPayload
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
    id: string,
    holder_id_doc_type: string,
    holder_id_number: string,
    account_type: string,
    holder_full_name: string,
    state: {
        id: string,
        name: string,
        alpha_code: string
    },
    municipality: {
        id: string,
        name: string,
        alpha_code: string
    },
    last_login: string | null,
    first_name: string | null,
    middle_name: string |null,
    last_name: string | null,
    second_last_name: null,
    phone_number:string | null,
    email: string | null
}


}

export const counterSlice = createSlice({
  name: 'loginUser',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<LoginState>) => {
      return { loggedIn: true, ...action.payload };
    },
    logout: () => {
      return { loggedIn: false };
    },
    updateUserInfo : (state, action) => {
      return {
        ...state ,
        user_info: {
          ...state.user_info,
          ...action.payload
        }
      }
    }
  },
});

export const { login, logout, updateUserInfo } = counterSlice.actions;

export const loginUser = (state: RootState) => state.loginUser;

export default counterSlice.reducer;
