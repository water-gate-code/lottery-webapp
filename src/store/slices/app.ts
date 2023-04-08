import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface AppState {
  initialized: boolean;
}

const initialState = { initialized: false } as AppState;

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initialize: (state, action: PayloadAction<void>) => {
      state.initialized = true;
    },
  },
});

export const { initialize } = appSlice.actions;
export const selectApp = (state: RootState) => state.app;
export const appReducer = appSlice.reducer;
