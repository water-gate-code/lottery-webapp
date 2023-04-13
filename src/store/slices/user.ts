import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import { getBalance } from "../../utils/wallet";

// Define a type for the slice state
interface UserStateUnauth {
  authed: false;
}
interface UserStateAuthed {
  authed: true;
  address: string;
  balance?: string;
}

type UserState = UserStateAuthed | UserStateUnauth;

/* 
createSlice Discriminated unions
Is possible to use an typescript Union type for the state of a Redux Toolkit Slice?
https://stackoverflow.com/questions/72185233/is-is-possible-to-use-an-typescript-union-type-for-the-state-of-a-redux-toolkit
https://redux-toolkit.js.org/usage/usage-with-typescript#defining-the-initial-state-type
*/
const initialState = {
  authed: false,
} as UserState;

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    auth: (state, action: PayloadAction<string>) => {
      return {
        authed: true,
        address: action.payload,
      };
    },
    clearBalance: (state) => {
      if (state.authed) {
        state.balance = undefined;
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(updateBalance.fulfilled, (state, action) => {
      if (state.authed) {
        state.balance = action.payload;
      }
    });
  },
});

export const { auth, clearBalance } = userSlice.actions;

export const updateBalance = createAsyncThunk(
  "user/updateBalance",
  async (address: string) => {
    const balance = await getBalance(address);
    return balance;
  }
);

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export const userReducer = userSlice.reducer;
