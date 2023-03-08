import { useReducer, useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import "./App.css";

import { getAccounts, getChainId } from "../utils";
import {
  WalletContext,
  WalletDispatchContext,
  initialWallet,
  walletReducer,
  WALLET_ACTION_TYPES,
} from "../WalletContext";
import { router } from "../router";

const { ethereum } = window;

function useInitializeWallet() {
  const [wallet, dispatch] = useReducer(walletReducer, initialWallet);

  useEffect(() => {
    async function dispatchUpdatedWallet() {
      const chainId = await getChainId();
      const accounts = await getAccounts();
      const type = WALLET_ACTION_TYPES.UPDATE_WALLET;
      dispatch({ type, wallet: { accounts, chainId, initialized: true } });
    }

    dispatchUpdatedWallet();

    ethereum.on("accountsChanged", dispatchUpdatedWallet);
    ethereum.on("disconnect", dispatchUpdatedWallet);
    ethereum.on("chainChanged", dispatchUpdatedWallet);
    return () => {
      ethereum.removeListener("accountsChanged", dispatchUpdatedWallet);
      ethereum.removeListener("disconnect", dispatchUpdatedWallet);
      ethereum.removeListener("chainChanged", dispatchUpdatedWallet);
    };
  }, []);
  return { wallet, dispatch };
}

function App() {
  const { wallet, dispatch } = useInitializeWallet();
  return (
    <WalletContext.Provider value={wallet}>
      <WalletDispatchContext.Provider value={dispatch}>
        {wallet.initialized ? <RouterProvider router={router} /> : null}
      </WalletDispatchContext.Provider>
    </WalletContext.Provider>
  );
}

export default App;
