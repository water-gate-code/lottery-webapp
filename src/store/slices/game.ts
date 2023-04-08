import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { Game } from "../../utils/casino";

interface GamePlay {
  game: Game;
  status: "idle" | "loading" | "finished";
  result: "win" | "lose" | "equal";
}
interface GameState {
  gameList: Game[];
  currentGamePlay?: GamePlay;
}

const initialState = {
  gameList: [],
} as GameState;

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameList: (state, action: PayloadAction<Game[]>) => {
      state.gameList = action.payload;
    },
  },
});

export const { setGameList } = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectGame = (state: RootState) => state.game;

export const gameReducer = gameSlice.reducer;
