import { useReducer, useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { getAccounts, getChainId, getBalance } from "./utils";
import {
  WalletContext,
  WalletDispatchContext,
  initialWallet,
  walletReducer,
  WALLET_ACTION_TYPES,
} from "./contexts/WalletContext";
import {
  NotificationContext,
  NotificationDispatchContext,
  initialNotification,
  notificationReducer,
  NOTIFICATION_ACTION_TYPES,
  NotificationType,
  createNotification,
} from "./contexts/NotificationContext";

import { router } from "./router";

const { ethereum } = window;

function errorEventParser(errorEvent) {
  const message =
    errorEvent.reason?.data?.message ||
    errorEvent.reason?.message ||
    errorEvent.message;
  return { message };
}

function useInitializeApp() {
  const [wallet, walletDispatch] = useReducer(walletReducer, initialWallet);
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    initialNotification
  );

  useEffect(() => {
    async function dispatchUpdatedWallet() {
      const chainId = await getChainId();
      const accounts = await getAccounts();
      const balance = {};
      if (accounts.length > 0) {
        const defaultAccount = accounts[0];
        balance[defaultAccount] = await getBalance(defaultAccount);
      }

      walletDispatch({
        type: WALLET_ACTION_TYPES.UPDATE_WALLET,
        wallet: { accounts, balance, chainId, initialized: true },
      });
    }

    function errorHandler(errorEvent) {
      // event.preventDefault(); // This will not print the error in the console });
      // TODO: https://reactjs.org/docs/error-boundaries.html

      const { message } = errorEventParser(errorEvent);
      if (message) {
        const notification = createNotification(
          NotificationType.danger,
          message
        );
        notificationDispatch({
          type: NOTIFICATION_ACTION_TYPES.ADD_NOTIFICATION,
          notification,
        });
        setTimeout(() => {
          notificationDispatch({
            type: NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION,
            id: notification.id,
          });
        }, 3000);
      }
    }

    dispatchUpdatedWallet();

    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);

    ethereum.on("accountsChanged", dispatchUpdatedWallet);
    ethereum.on("disconnect", dispatchUpdatedWallet);
    ethereum.on("chainChanged", dispatchUpdatedWallet);
    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", errorHandler);

      ethereum.removeListener("accountsChanged", dispatchUpdatedWallet);
      ethereum.removeListener("disconnect", dispatchUpdatedWallet);
      ethereum.removeListener("chainChanged", dispatchUpdatedWallet);
    };
  }, []);
  return { wallet, walletDispatch, notification, notificationDispatch };
}

export function App() {
  const { wallet, walletDispatch, notification, notificationDispatch } =
    useInitializeApp();
  return (
    <NotificationContext.Provider value={notification}>
      <NotificationDispatchContext.Provider value={notificationDispatch}>
        <WalletContext.Provider value={wallet}>
          <WalletDispatchContext.Provider value={walletDispatch}>
            {wallet.initialized ? <RouterProvider router={router} /> : null}
          </WalletDispatchContext.Provider>
        </WalletContext.Provider>
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}
