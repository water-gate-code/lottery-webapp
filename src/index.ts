import "./scss/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import { mountApp } from "./components/Boot";
import {
  reportWebVitals,
  sendToGoogleAnalytics,
} from "./utils/reportWebVitals";
import { store } from "./store";
import { getAccounts, getBalance, getChainId } from "./utils/wallet";
import { auth, selectUser, setBalance } from "./store/slices/user";
import {
  NotificationType,
  clearNotify,
  initialize,
  newNotification,
  notify,
} from "./store/slices/app";
import { selectCasino, setChain } from "./store/slices/chain";
import { errorEventParser } from "./utils/tools";
import { fetchGames, selectGame, setGameResult } from "./store/slices/game";
import { GameResult, getCasino, isEmptyAddress } from "./utils/casino";
import { DisplayInfoStructOutput } from "./utils/types/Casino";

const { ethereum } = window;

function errorHandler(errorEvent: any) {
  // event.preventDefault(); // This will not print the error in the console });

  const { message } = errorEventParser(errorEvent);
  if (message) {
    const notification = newNotification(NotificationType.danger, message);
    store.dispatch(notify(notification));
    setTimeout(() => store.dispatch(clearNotify(notification)), 3000);
  }
}

// TODO: very ugly apply, need to refactor ASAP
const onCreate = (game: DisplayInfoStructOutput) => {
  // store.dispatch(addGame(formatGame(game)));
};
const onComplete = (winner: string) => {
  const isWinner = (a: string) => a.toLowerCase() === winner.toLowerCase();
  const user = selectUser(store.getState());
  const game = selectGame(store.getState());
  const gameId = game.currentGamePlay.game.value?.id;
  const result = isEmptyAddress(winner)
    ? GameResult.draw
    : user.authed && isWinner(user.address)
    ? GameResult.win
    : GameResult.lose;
  store.dispatch(setGameResult({ gameId: gameId ?? "unknow", result }));
  // navigate(`/result/${result > 0 ? "win" : result < 0 ? "lose" : "equal"}`);
};
async function updateChainId() {
  const preCasino = selectCasino(store.getState());

  if (preCasino !== null) {
    preCasino.offCreateGame(onCreate);
    preCasino.offCompleteGame(onComplete);
  }

  const chainId = await getChainId();
  store.dispatch(setChain(chainId));

  const casino = getCasino(chainId);
  if (casino !== null) {
    store.dispatch(fetchGames({ casino }));

    casino.onCreateGame(onCreate);
    casino.onCompleteGame(onComplete);
  }
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
  console.log(`[wallet.event] ${args[0]}:`, args);
  setWallet();
};

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

window.addEventListener("error", errorHandler);
window.addEventListener("unhandledrejection", errorHandler);

ethereum.on("connect", onWalletChange.bind(this, "connect"));
ethereum.on("disconnect", onWalletChange.bind(this, "disconnect"));
ethereum.on("accountsChanged", onWalletChange.bind(this, "accountsChanged"));
ethereum.on("chainChanged", onWalletChange.bind(this, "chainChanged"));
ethereum.on("message", onWalletChange.bind(this, "message"));

reportWebVitals(sendToGoogleAnalytics);
setWallet();

const rootDom = document.getElementById("root");
if (rootDom !== null) mountApp(rootDom);
