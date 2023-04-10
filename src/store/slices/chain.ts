import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import {
  ChainConfig,
  ChainInfo,
  chains,
  supportChainIds,
} from "../../utils/chains";
import { getCasino } from "../../utils/casino";

interface ChainStateNull {
  id: null;
}
interface ChainStateUnsupport {
  id: number;
  support: false;
}
interface ChainStateSupport {
  id: number;
  support: true;
  config: ChainConfig;
  info: ChainInfo;
}

type ChainState = ChainStateNull | ChainStateSupport | ChainStateUnsupport;

const initialState = { id: null } as ChainState;

export const chainSlice = createSlice({
  name: "chain",
  initialState,
  reducers: {
    setChain: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!supportChainIds.includes(id)) {
        return {
          support: false,
          id,
        };
      }

      const config = chains[id];
      const info = config.info;
      return {
        support: true,
        id,
        config,
        info,
      };
    },
  },
});

export const { setChain } = chainSlice.actions;
export const selectChain = (state: RootState) => state.chain;
export const selectCasino = (state: RootState) => getCasino(state.chain.id);
export const chainReducer = chainSlice.reducer;
