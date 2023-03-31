const { ethereum } = window;
const { ethers } = window;

const CREATEGAME_EVENT = "CreateGame_Event";
const COMPLETEGAME_EVENT = "CompleteGame_Event";

export const ethRequest = async (args) => {
  try {
    const response = await ethereum.request(args);
    console.info(`[wallet.request]: ${args.method}:`, response);
    return response;
  } catch (error) {
    console.error(`[wallet.request]: ${args.method}:`, error);
    throw error;
  }
};

export async function connectWallet() {
  return await ethRequest({ method: "eth_requestAccounts" });
}
export async function getAccounts() {
  return await ethRequest({ method: "eth_accounts" });
}
export async function getBalance(account) {
  const balance = await ethRequest({
    method: "eth_getBalance",
    params: [account, "latest"],
  });
  return ethers.utils.formatEther(balance);
}
export async function getChainId() {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return parseInt(chainId);
}

export async function switchNetwork(chainId) {
  return await ethRequest({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: toHex(chainId) }],
  });
}

export async function addToNetwork({ address, chain, rpc }) {
  if (!address) {
    await connectWallet();
  }

  const params = {
    chainId: toHex(chain.chainId), // A 0x-prefixed hexadecimal string
    chainName: chain.name,
    nativeCurrency: {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol, // 2-6 characters long
      decimals: chain.nativeCurrency.decimals,
    },
    rpcUrls: rpc ? [rpc] : chain.rpc.map((r) => r?.url ?? r),
    blockExplorerUrls: [
      chain.explorers && chain.explorers.length > 0 && chain.explorers[0].url
        ? chain.explorers[0].url
        : chain.infoURL,
    ],
  };

  const result = await ethRequest({
    method: "wallet_addEthereumChain",
    params: [params, address],
  });

  return result;
}

export const toHex = (num) => "0x" + num.toString(16);

export const shortenAddress = (address) => {
  const begin = address.substr(0, 4);
  const end = address.substr(address.length - 4, 4);
  return begin + "•••" + end;
};

const formatGame = (game) => {
  const { id, gameType, wager, gamblers } = game;

  return {
    id: id.toString(),
    type: parseInt(gameType.toString()),
    player1: gamblers[0].id.toString(),
    betAmount: ethers.utils.formatEther(wager),
    player1BetNumber: gamblers[0].choice.toString(),
    isActive: gamblers.length < 2,
  };
};

export class Casino {
  #chain;
  #contract;
  #signedContract;
  #provider;
  constructor(chain) {
    if (!chain) throw new Error("Chain id is required!");
    this.#chain = chain;
    const { address, abi } = this.#chain.contracts.Casino;
    this.#provider = new ethers.providers.Web3Provider(ethereum);
    this.#contract = new ethers.Contract(address, abi, this.#provider);
    const signer = this.#provider.getSigner();
    this.#signedContract = new ethers.Contract(address, abi, signer);
  }

  async getGames() {
    const games = await this.#contract.getGames();
    return games.map(formatGame);
  }
  async getGame(gameId) {
    const game = await this.#contract.getGame(gameId);
    return formatGame(game);
  }
  async createGame(amount, gameType, bet) {
    const response = await this.#signedContract.createGame(gameType, bet, {
      value: ethers.utils.parseEther(amount),
    });
    const receipt = await response.wait();
    const { events } = receipt;

    const createGameEvent = events.find((e) => e.event === CREATEGAME_EVENT);

    return formatGame(createGameEvent.args.game);
  }
  async playGame(amount, gameId, bet) {
    const response = await this.#signedContract.playGame(gameId, bet, {
      value: ethers.utils.parseEther(amount),
    });

    const receipt = await response.wait();
    const { events } = receipt;

    const completeGameEvent = events.find(
      (e) => e.event === COMPLETEGAME_EVENT
    );

    return completeGameEvent.args.winner;
  }
}

// function createGameListener(game, event) {
//   console.log(`[contract event]: ${CREATEGAME_EVENT}`, { game, event });
// }

// export function onCreateGame() {
//   casino(80001, true).contract.on(CREATEGAME_EVENT, createGameListener);
// }
// export function offCreateGame() {
//   casino(80001, true).contract.off(CREATEGAME_EVENT, createGameListener);
// }
