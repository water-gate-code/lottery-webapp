import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import { Casino, Game } from "../../utils/casino";

interface RemoteData<T> {
  value: T;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: any;
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
    addGame: (state, action: PayloadAction<Game>) => {
      return {
        ...state,
        gameList: {
          ...state.gameList,
          value: [...state.gameList.value, action.payload],
        },
      };
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
export const { addGame } = gameSlice.actions;
export const selectGame = (state: RootState) => state.game;

export const gameReducer = gameSlice.reducer;
