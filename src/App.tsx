import { useReducer, useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { getAccounts, getChainId, getBalance } from "./utils";
import { useAppDispatch, useAppSelector } from "./hooks";
import { auth } from "./store/slices/user";
import { initialize, selectApp } from "./store/slices/app";
import { setChain } from "./store/slices/chain";
import { eventEmitter, Events } from "./event";
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

function errorEventParser(errorEvent: any) {
  const message =
    errorEvent.reason?.data?.message ||
    errorEvent.reason?.message ||
    errorEvent.message;
  return { message };
}

function useInitializeApp() {
  const dispatch = useAppDispatch();

  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    initialNotification
  );

  useEffect(() => {
    // Global error handler
    function errorHandler(errorEvent: any) {
      // event.preventDefault(); // This will not print the error in the console });

      const { message } = errorEventParser(errorEvent);
      if (message) {
        const notification = createNotification(
          NotificationType.danger,
          message
        );
        notificationDispatch({
          type: NOTIFICATION_ACTION_TYPES.ADD_NOTIFICATION,
          payload: notification,
        });
        setTimeout(() => {
          notificationDispatch({
            type: NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION,
            payload: notification,
          });
        }, 3000);
      }
    }
    // Add listener on all possible error event
    // TODO: https://reactjs.org/docs/error-boundaries.html
    window.addEventListener("error", errorHandler);
    window.addEventListener("unhandledrejection", errorHandler);

    // Fetch and dispatch necessary wallet information
    async function dispatchUpdatedWallet() {
      const chainId = await getChainId();
      const accounts = await getAccounts();
      if (accounts.length > 0) {
        const address = accounts[0];
        const balance = await getBalance(address);
        dispatch(auth({ address, balance }));
      }
      dispatch(initialize());
      dispatch(setChain(chainId));
    }
    // Initialize necessary wallet information
    dispatchUpdatedWallet();
    function onConnect(connectInfo: any) {
      console.log("[wallet.event] connect. ConnectInfo:", connectInfo);
      dispatchUpdatedWallet();
    }
    function onDisconnect(error: any) {
      console.log("[wallet.event] disconnect. ProviderRpcError:", error);
      dispatchUpdatedWallet();
    }
    function onAccountsChanged(accounts: any) {
      console.log("[wallet.event] accountsChanged. accounts:", accounts);
      dispatchUpdatedWallet();
    }
    function onChainChanged(chainId: any) {
      console.log("[wallet.event] chainChanged. chainId:", chainId);
      dispatchUpdatedWallet();
    }
    function onMessage(message: any) {
      console.log("[wallet.event] message. ProviderMessage:", message);
      dispatchUpdatedWallet();
    }

    ethereum.on("connect", onConnect);
    ethereum.on("disconnect", onDisconnect);
    ethereum.on("accountsChanged", onAccountsChanged);
    ethereum.on("chainChanged", onChainChanged);
    ethereum.on("message", onMessage);

    eventEmitter.on(Events.CREATE_GAME, dispatchUpdatedWallet);
    eventEmitter.on(Events.COMPLETE_GAME, dispatchUpdatedWallet);
    return () => {
      window.removeEventListener("error", errorHandler);
      window.removeEventListener("unhandledrejection", errorHandler);

      ethereum.removeListener("connect", onConnect);
      ethereum.removeListener("disconnect", onDisconnect);
      ethereum.removeListener("accountsChanged", onAccountsChanged);
      ethereum.removeListener("chainChanged", onChainChanged);
      ethereum.removeListener("message", onMessage);

      eventEmitter.removeListener(Events.CREATE_GAME, dispatchUpdatedWallet);
      eventEmitter.removeListener(Events.COMPLETE_GAME, dispatchUpdatedWallet);
    };
  }, [dispatch]);
  return { notification, notificationDispatch };
}

export function App() {
  const { initialized } = useAppSelector(selectApp);
  const { notification, notificationDispatch } = useInitializeApp();
  if (!initialized)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  return (
    <NotificationContext.Provider value={notification}>
      <NotificationDispatchContext.Provider value={notificationDispatch}>
        <RouterProvider router={router} />
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}
