import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { userReducer } from "./slices/user";
import { chainReducer } from "./slices/chain";
import { appReducer } from "./slices/app";
import { gameReducer } from "./slices/game";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chain: chainReducer,
    app: appReducer,
    game: gameReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
