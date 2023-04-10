import { createSlice, PayloadAction, nanoid } from "@reduxjs/toolkit";

import type { RootState } from "../";
import { metamaskInstalled } from "../../utils/wallet";

export enum NotificationType {
  info,
  warning,
  success,
  danger,
}
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
}

interface AppState {
  initialized: boolean;
  metamaskInstalled: boolean;
  notifications: Notification[];
}

export function newNotification(
  type: NotificationType,
  title: string
): Notification {
  const id = nanoid();
  return { id, type, title };
}

const initialState = {
  initialized: false,
  metamaskInstalled: metamaskInstalled(),
  notifications: [],
} as AppState;

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initialize: (state) => {
      state.initialized = true;
    },
    notify: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    clearNotify: (state, action: PayloadAction<Notification>) => {
      const { notifications } = state;

      const index = notifications.findIndex((n) => n.id === action.payload.id);
      notifications.splice(index, 1);
    },
  },
});

export const { initialize, notify, clearNotify } = appSlice.actions;
export const selectApp = (state: RootState) => state.app;
export const appReducer = appSlice.reducer;
