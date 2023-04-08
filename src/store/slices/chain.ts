import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../";
import {
  ChainConfig,
  ChainInfo,
  chains,
  supportChainIds,
} from "../../utils/chains";
import { Casino } from "../../utils/casino";

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
export const selectSupport = (state: RootState) =>
  state.chain.id !== null && state.chain.support;
export const selectCasino = (function () {
  const casinoCache: { [chainId: number]: Casino } = {};
  return (state: RootState) => {
    const { chain } = state;
    if (chain.id !== null && chain.support) {
      if (!casinoCache[chain.id])
        casinoCache[chain.id] = new Casino(chain.config);

      return casinoCache[chain.id];
    }
    return null;
  };
})();
export const chainReducer = chainSlice.reducer;
