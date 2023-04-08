import "./scss/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import { mountApp } from "./components/Boot";
import {
  reportWebVitals,
  sendToGoogleAnalytics,
} from "./utils/reportWebVitals";
import { store } from "./store";
import { errorHandler } from "./errorHandler";
import { getAccounts, getBalance, getChainId } from "./utils/wallet";
import { auth, setBalance } from "./store/slices/user";
import { initialize } from "./store/slices/app";
import { setChain } from "./store/slices/chain";

const { ethereum } = window;

async function updateChainId() {
  const chainId = await getChainId();
  store.dispatch(setChain(chainId));
}
async function updateBalance(address: string) {
  const balance = await getBalance(address);
  store.dispatch(setBalance(balance));
}
async function updateAuth() {
  store.dispatch(setBalance(undefined));
  const accounts = await getAccounts();
  if (accounts.length > 0) {
    const address = accounts[0];
    store.dispatch(auth(address));
    updateBalance(address);
  }
}

async function setWallet() {
  await updateChainId();
  await updateAuth();
  store.dispatch(initialize());
}
const onWalletChange = (...args: any[]) => {
  console.log("[wallet.event]:", args);
  setWallet();
};

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

window.addEventListener("error", errorHandler);
window.addEventListener("unhandledrejection", errorHandler);

ethereum.on("connect", onWalletChange);
ethereum.on("disconnect", onWalletChange);
ethereum.on("accountsChanged", onWalletChange);
ethereum.on("chainChanged", onWalletChange);
ethereum.on("message", onWalletChange);

reportWebVitals(sendToGoogleAnalytics);
setWallet();

const rootDom = document.getElementById("root");
if (rootDom !== null) mountApp(rootDom);
