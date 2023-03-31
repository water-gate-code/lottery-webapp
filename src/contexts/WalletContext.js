import { createContext } from "react";
import { chains } from "../chains";
import { Casino } from "../utils";

export const WalletContext = createContext(null);
export const WalletDispatchContext = createContext(null);

export const WALLET_ACTION_TYPES = {
  UPDATE_WALLET: "UPDATE_WALLET",
  DISCONNECTED: "DISCONNECTED",
};

export function walletReducer(wallet, action) {
  switch (action.type) {
    case WALLET_ACTION_TYPES.UPDATE_WALLET: {
      const { accounts, balance, chainId, initialized } = action.wallet;
      const chain = chains[chainId];
      return {
        ...wallet,
        accounts,
        balance: { ...balance },
        chain,
        initialized,
        casino: chain ? new Casino(chain) : null,
      };
    }
    case WALLET_ACTION_TYPES.DISCONNECTED: {
      return initialWallet;
    }
    default: {
      throw Error("Unknown wallet action: " + action.type);
    }
  }
}

export const initialWallet = {
  accounts: [], // 当前登陆的账号
  balance: {},
  chain: null,
  initialized: false,
  casino: null,
};
