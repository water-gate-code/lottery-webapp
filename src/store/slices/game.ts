import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import { Casino, Game, GameResult } from "../../utils/casino";

interface RemoteData<T> {
  value: T | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: any;
}
interface GamePlay {
  game: RemoteData<Game>;
  result: GameResult | null;
}
// interface GameResultMap{[gameId: string]: GameResult} ;
interface GameState {
  gameList: RemoteData<Game[]>;
  currentGamePlay: GamePlay;
  gameResults: { [gameId: string]: GameResult };
}

const initialState = {
  gameList: {
    value: [],
    status: "idle",
  },
  currentGamePlay: {
    game: {
      value: null,
      status: "idle",
    },
    result: null,
  },
  gameResults: {},
} as GameState;

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addGame: (state, action: PayloadAction<Game>) => {
      const newGameList =
        state.gameList.value !== null
          ? [...state.gameList.value, action.payload]
          : [action.payload];
      return {
        ...state,
        gameList: {
          ...state.gameList,
          value: newGameList,
        },
      };
    },
    setGameResult: (
      state,
      action: PayloadAction<{ gameId: string; result: GameResult }>
    ) => {
      const { gameId, result } = action.payload;
      state.gameResults[gameId] = result;
      const finishedIndex = state.gameList.value?.findIndex(
        (g) => g.id === gameId
      );
      if (finishedIndex && finishedIndex >= 0) {
        state.gameList.value?.splice(finishedIndex, 1);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.gameList.status = "loading";
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.gameList.status = "succeeded";
        state.gameList.value = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.gameList.status = "failed";
        state.gameList.error = action.error;
        throw action.error;
      });

    builder
      .addCase(fetchGame.pending, (state) => {
        state.currentGamePlay.game.status = "loading";
      })
      .addCase(fetchGame.fulfilled, (state, action) => {
        state.currentGamePlay.game.status = "succeeded";
        state.currentGamePlay.game.value = action.payload;
      })
      .addCase(fetchGame.rejected, (state, action) => {
        state.currentGamePlay.game.status = "failed";
        state.currentGamePlay.game.error = action.error;
        throw action.error;
      });
  },
});

export const fetchGames = createAsyncThunk(
  "game/fetchGames",
  async ({ casino }: { casino: Casino }) => {
    const games = await casino.getGames();
    return games;
  }
);
export const fetchGame = createAsyncThunk(
  "game/fetchGame",
  async ({ casino, gameId }: { casino: Casino; gameId: string }) => {
    const game = await casino.getGame(gameId);
    return game;
  }
);
export const { addGame, setGameResult } = gameSlice.actions;
export const selectGame = (state: RootState) => state.game;

export const gameReducer = gameSlice.reducer;
