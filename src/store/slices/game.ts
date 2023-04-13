import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import { Casino, Game, GameResult } from "../../utils/casino";
import { GameType } from "../../utils/casino";

interface RemoteData<T> {
  value: T | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: unknown;
}
interface GamePlay {
  game: RemoteData<Game>;
}
interface GameCreate {
  game: RemoteData<Game>;
}
// interface GameResultMap{[gameId: string]: GameResult} ;
interface GameState {
  gameList: RemoteData<Game[]>;
  gameResults: { [gameId: string]: GameResult };
  currentGamePlay: GamePlay;
  createGames: { [creationId: string]: GameCreate };
}
const initialState = {
  gameList: {
    value: [],
    status: "idle",
  },
  gameResults: {},
  currentGamePlay: {
    game: {
      value: null,
      status: "idle",
    },
  },
  createGames: {},
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
    clearCreateGame: (state) => {
      return {
        ...state,
        currentGameCreate: {
          game: {
            value: null,
            status: "idle",
          },
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
      });

    builder
      .addCase(createGame.pending, (state, action) => {
        const creationId = action.meta.arg.creationId;
        if (!state.createGames[creationId]) {
          state.createGames[creationId] = {
            game: {
              value: null,
              status: "loading",
            },
          };
        }
      })
      .addCase(createGame.fulfilled, (state, action) => {
        const creationId = action.meta.arg.creationId;
        if (!state.createGames[creationId])
          throw new Error("Invalid request id");

        state.createGames[creationId].game.status = "succeeded";
        state.createGames[creationId].game.value = action.payload;
      })
      .addCase(createGame.rejected, (state, action) => {
        const creationId = action.meta.arg.creationId;
        if (!state.createGames[creationId])
          throw new Error("Invalid request id");

        state.createGames[creationId].game.status = "failed";
        state.createGames[creationId].game.error = action.error;
        // TODO: cant throw error here, need to show error to user later some how
      });

    builder
      .addCase(playGameWithDefaultHost.pending, (state, action) => {
        const creationId = action.meta.arg.creationId;
        if (!state.createGames[creationId]) {
          state.createGames[creationId] = {
            game: {
              value: null,
              status: "loading",
            },
          };
        }
      })
      .addCase(playGameWithDefaultHost.fulfilled, (state, action) => {
        const creationId = action.meta.arg.creationId;
        if (!state.createGames[creationId])
          throw new Error("Invalid request id");

        state.createGames[creationId].game.status = "succeeded";
        state.createGames[creationId].game.value = action.payload;
      })
      .addCase(playGameWithDefaultHost.rejected, (state, action) => {
        const creationId = action.meta.arg.creationId;
        if (!state.createGames[creationId])
          throw new Error("Invalid request id");

        state.createGames[creationId].game.status = "failed";
        state.createGames[creationId].game.error = action.error;
        // TODO: cant throw error here, need to show error to user later some how
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
export const createGame = createAsyncThunk(
  "game/createGame",
  async ({
    casino,
    creationId,
    type,
    wager,
    choice,
  }: {
    casino: Casino;
    creationId: string;
    type: GameType;
    wager: string;
    choice: number;
  }) => {
    const game = await casino.createGame(wager, type, choice);
    return game;
  }
);

export const playGameWithDefaultHost = createAsyncThunk(
  "game/playGameWithDefaultHost",
  async ({
    casino,
    creationId,
    type,
    wager,
    choice,
  }: {
    casino: Casino;
    creationId: string;
    type: GameType;
    wager: string;
    choice: number;
  }) => {
    const game = await casino.playGameWithDefaultHost(wager, type, choice);
    return game;
  }
);

export const { addGame, setGameResult } = gameSlice.actions;
export const selectGame = (state: RootState) => state.game;

export const gameReducer = gameSlice.reducer;
