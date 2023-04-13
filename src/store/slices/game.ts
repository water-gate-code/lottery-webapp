import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameResult } from "../../utils/casino";
import { RootState } from "..";

interface GameState {
  gameResults: { [gameId: string]: GameResult };
}
const initialState = {
  gameResults: {},
} as GameState;

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameResult: (
      state,
      action: PayloadAction<{ gameId: string; result: GameResult }>
    ) => {
      const { gameId, result } = action.payload;
      state.gameResults[gameId] = result;
    },
  },
});

export const { setGameResult } = gameSlice.actions;
export const selectGame = (state: RootState) => state.game;
export const gameReducer = gameSlice.reducer;
