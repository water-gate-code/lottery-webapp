import { createContext } from "react";

export const WalletContext = createContext(null);
export const WalletDispatchContext = createContext(null);

export const WALLET_ACTION_TYPES = {
  UPDATE_WALLET: "UPDATE_WALLET",
  DISCONNECTED: "DISCONNECTED",
};

export function walletReducer(wallet, action) {
  switch (action.type) {
    case "UPDATE_WALLET": {
      return action.wallet;
    }
    case "DISCONNECTED": {
      return initialWallet;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export const initialWallet = {
  accounts: [], // 当前登陆的账号
  chainId: null,
  initialized: false,
};
