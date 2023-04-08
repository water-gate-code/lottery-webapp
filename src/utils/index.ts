import type { ChainConfig, ChainInfo } from "../chains";

const { ethereum } = window;
const { ethers } = window;

const CREATEGAME_EVENT = "CreateGame_Event";
const COMPLETEGAME_EVENT = "CompleteGame_Event";

export const metamaskInstalled = () => {
  return !!ethereum;
};

export const ethRequest = async (args: any) => {
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
export async function getAccounts(): Promise<string[]> {
  return await ethRequest({ method: "eth_accounts" });
}
export async function getBalance(address: string): Promise<string> {
  const balance = await ethRequest({
    method: "eth_getBalance",
    params: [address, "latest"],
  });
  return ethers.utils.formatEther(balance);
}
export async function getChainId() {
  const chainId = await ethRequest({ method: "eth_chainId" });
  return parseInt(chainId);
}

export async function switchNetwork(chainId: number) {
  return await ethRequest({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: toHex(chainId) }],
  });
}

export async function addToNetwork(
  address: string | null,
  chainInfo: ChainInfo
) {
  if (address === null) {
    await connectWallet();
  }

  const params = {
    chainId: toHex(chainInfo.chainId), // A 0x-prefixed hexadecimal string
    chainName: chainInfo.name,
    nativeCurrency: {
      name: chainInfo.nativeCurrency.name,
      symbol: chainInfo.nativeCurrency.symbol, // 2-6 characters long
      decimals: chainInfo.nativeCurrency.decimals,
    },
    rpcUrls: chainInfo.rpc,
    blockExplorerUrls: [
      chainInfo.explorers &&
      chainInfo.explorers.length > 0 &&
      chainInfo.explorers[0].url
        ? chainInfo.explorers[0].url
        : chainInfo.infoURL,
    ],
  };

  const result = await ethRequest({
    method: "wallet_addEthereumChain",
    params: [params, address],
  });

  return result;
}

export const toHex = (num: number) => "0x" + num.toString(16);

export const shortenAddress = (address: string) => {
  const begin = address.substring(0, 4);
  const end = address.substring(address.length - 4);
  return begin + "•••" + end;
};

interface RawChainGambler {
  id: string;
  choice: number;
}

interface RawChainGameGame {
  id: string;
  gameType: number;
  wager: number;
  gamblers: RawChainGambler[];
}
const formatGame = (game: RawChainGameGame) => {
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
  constructor(chain: ChainConfig) {
    if (!chain) throw new Error("Chain is required!");
    this.#chain = chain;
    const { address, abi } = this.#chain.contracts.Casino;
    this.#provider = new ethers.providers.Web3Provider(ethereum);
    this.#contract = new ethers.Contract(address, abi, this.#provider);
    const signer = this.#provider.getSigner();
    this.#signedContract = new ethers.Contract(address, abi, signer);
  }

  on(event: string, callback: Function) {
    this.#contract.on(event, callback);
  }
  off(event: string, callback: Function) {
    this.#contract.off(event, callback);
  }

  async getGames() {
    const games = await this.#contract.getGames();
    return games.map(formatGame);
  }
  async getGame(gameId: string) {
    const game = await this.#contract.getGame(gameId);
    return formatGame(game);
  }
  async createGame(amount: number, gameType: number, bet: number) {
    const response = await this.#signedContract.createGame(gameType, bet, {
      value: ethers.utils.parseEther(amount.toString()),
    });
    const receipt = await response.wait();
    const { events } = receipt;

    const createGameEvent = events.find(
      (e: any) => e.event === CREATEGAME_EVENT
    );

    return formatGame(createGameEvent.args.game);
  }
  async playGame(amount: number, gameId: string, bet: number) {
    const response = await this.#signedContract.playGame(gameId, bet, {
      value: ethers.utils.parseEther(amount.toString()),
    });

    return await response.wait();
  }
  parseWinnerFromEvent(receipt: any) {
    const { events } = receipt;

    const completeGameEvent = events.find(
      (e: any) => e.event === COMPLETEGAME_EVENT
    );

    return completeGameEvent.args.winner;
  }
}
