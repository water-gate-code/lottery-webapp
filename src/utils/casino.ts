import type { Listener } from "ethers";
import { formatEther, BrowserProvider, parseEther, Contract } from "ethers";
import { ChainConfig, chains } from "./chains";
import CasinoArtifact from "./contracts/Casino.json";

const { ethereum } = window;

export const CREATEGAME_EVENT = "CreateGame_Event";
export const COMPLETEGAME_EVENT = "CompleteGame_Event";

interface RawChainGambler {
  id: string;
  choice: number;
}

export interface RawChainGame {
  id: string;
  gameType: number;
  wager: number;
  gamblers: RawChainGambler[];
}
enum RawChainGameType {
  dice = 1,
  rps = 2,
}
export enum GameType {
  dice,
  rps,
}
export enum GameResult {
  win,
  lose,
  draw,
}

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
export const isEmptyAddress = (address: string) => {
  return address.toLowerCase() === EMPTY_ADDRESS;
};

export const getGameName = (gameType: GameType) => {
  switch (gameType) {
    case GameType.dice:
      return "Dice";
    case GameType.rps:
      return "Rock Paper Scissors";
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};
export function parseGameType(gameTypeKey: string) {
  switch (gameTypeKey) {
    case GameType[GameType.dice]:
      return GameType.dice;
    case GameType[GameType.rps]:
      return GameType.rps;
    default:
      throw new Error(`Invalid game type: ${gameTypeKey}`);
  }
}

export type Game = {
  id: string;
  type: GameType;
  player1: string;
  betAmount: string;
  player1BetNumber: string;
  isActive: boolean;
};

const getGameType = (rawGameType: any): GameType => {
  const parseedRawGameType: RawChainGameType = parseInt(rawGameType);
  switch (parseedRawGameType) {
    case RawChainGameType.dice:
      return GameType.dice;
    case RawChainGameType.rps:
      return GameType.rps;
    default:
      throw new Error(`Unknow raw game type: ${rawGameType}`);
  }
};
const getRawGameType = (gameType: GameType): RawChainGameType => {
  switch (gameType) {
    case GameType.dice:
      return RawChainGameType.dice;
    case GameType.rps:
      return RawChainGameType.rps;
    default:
      throw new Error(`Unknow game type: ${gameType}`);
  }
};

export const formatGame = (rawChainGame: RawChainGame): Game => {
  const { id, gameType, wager, gamblers } = rawChainGame;

  return {
    id: id.toString(),
    type: getGameType(gameType),
    player1: gamblers[0].id.toString(),
    betAmount: formatEther(wager),
    player1BetNumber: gamblers[0].choice.toString(),
    isActive: gamblers.length < 2,
  };
};

export class Casino {
  #chain;
  #contract;
  #provider;
  constructor(chain: ChainConfig) {
    if (!chain) throw new Error("Chain is required!");
    this.#chain = chain;
    const { address } = this.#chain.contracts.Casino;
    this.#provider = new BrowserProvider(ethereum);
    this.#contract = new Contract(address, CasinoArtifact.abi, this.#provider);
  }

  on(event: string, callback: Listener) {
    this.#contract.on(event, callback);
  }
  off(event: string, callback: Listener) {
    this.#contract.off(event, callback);
  }

  async getGames(): Promise<Game[]> {
    const games = await this.#contract.getGames();
    return games.map(formatGame);
  }
  async getGame(gameId: string): Promise<Game> {
    const game = await this.#contract.getGame(gameId);
    return formatGame(game);
  }
  async signedContract() {
    const signer = await this.#provider.getSigner();
    const { address } = this.#chain.contracts.Casino;
    return new Contract(address, CasinoArtifact.abi, signer);
  }
  async createGame(amount: number, gameType: GameType, bet: number) {
    const signedContract = await this.signedContract();
    const response = await signedContract.createGame(
      getRawGameType(gameType),
      bet,
      {
        value: parseEther(amount.toString()),
      }
    );
    const receipt = await response.wait();
    const { events } = receipt;

    const createGameEvent = events.find(
      (e: any) => e.event === CREATEGAME_EVENT
    );

    return formatGame(createGameEvent.args.game);
  }
  async playGame(amount: number, gameId: string, bet: number) {
    const signedContract = await this.signedContract();
    const response = await signedContract.playGame(gameId, bet, {
      value: parseEther(amount.toString()),
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

export const getCasino = (function () {
  const casinoCache: { [chainId: number]: Casino } = {};
  return (chainId: number | undefined | null) => {
    if (!chainId) return null;
    const chain = chains[chainId];
    if (!chain) return null;

    if (!casinoCache[chainId]) casinoCache[chainId] = new Casino(chain);
    return casinoCache[chainId];
  };
})();
