import { createContext } from "react";
import { chains } from "../chains";

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
      return {
        ...wallet,
        accounts,
        balance: { ...balance },
        chainId,
        chainInfo: chains[chainId] && chains[chainId].info,
        initialized,
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
  chainId: null,
  chainInfo: null,
  initialized: false,
};
