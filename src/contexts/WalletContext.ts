import { createContext, Dispatch } from "react";
import { chains, ChainConfig } from "../chains";
import { Casino } from "../utils";

export const WALLET_ACTION_TYPES = {
  UPDATE_WALLET: "UPDATE_WALLET",
  DISCONNECTED: "DISCONNECTED",
};

export function walletReducer(
  wallet: Wallet,
  action: { type: string; payload: Wallet }
) {
  switch (action.type) {
    case WALLET_ACTION_TYPES.UPDATE_WALLET: {
      const { accounts, balance, chainId, initialized } = action.payload;
      if (chainId !== null) {
        const chain = chains[chainId];
        return {
          ...wallet,
          accounts,
          balance: { ...balance },
          chainId,
          chain,
          initialized,
          casino: chain ? new Casino(chain) : null,
        };
      }
      throw Error("ChainId not exist: " + action);
    }
    case WALLET_ACTION_TYPES.DISCONNECTED: {
      return initialWallet;
    }
    default: {
      throw Error("Unknown wallet action: " + action.type);
    }
  }
}
interface Wallet {
  accounts: string[];
  balance: { [address: string]: number };
  chainId: number | null;
  chain: ChainConfig | null;
  initialized: boolean;
  casino: Casino | null;
}
export const initialWallet: Wallet = {
  accounts: [], // 当前登陆的账号
  balance: {},
  chainId: null,
  chain: null,
  initialized: false,
  casino: null,
};

export const WalletContext = createContext(initialWallet);
export const WalletDispatchContext = createContext<
  Dispatch<{ type: string; payload: Wallet }>
>(() => {});
