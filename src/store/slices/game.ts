import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import { Game } from "../../utils/casino";

interface RemoteData<T> {
  value: T;
  status: "idle" | "fetching" | "fetched";
}
interface GamePlay {
  game: RemoteData<Game>;
  status: "idle" | "loading" | "finished";
  result: "win" | "lose" | "equal";
}
interface GameState {
  gameList: RemoteData<Game[]>;
  currentGamePlay?: GamePlay;
}

const initialState = {
  gameList: {
    value: [],
    status: "idle",
  },
} as GameState;

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameList: (state, action: PayloadAction<Game[]>) => {
      state.gameList = {
        value: action.payload,
        status: "fetched",
      };
    },
  },
});

export const { setGameList } = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectGame = (state: RootState) => state.game;

export const gameReducer = gameSlice.reducer;
