import type { ChainConfig } from "./chains";

const { ethereum } = window;
const { ethers } = window;

const CREATEGAME_EVENT = "CreateGame_Event";
const COMPLETEGAME_EVENT = "CompleteGame_Event";

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
enum RawChainGameType {
  dice = 1,
  rps = 2,
}
export enum GameType {
  dice,
  rps,
}

export interface DiceGame {
  gameType: GameType.dice;
  id: string;
  wager: string;
  playerA: string;
  playerB: string;
  finished: boolean;
}
export interface RpsGame {
  gameType: GameType.rps;
  id: string;
  wager: string;
  playerA: string;
  playerB: string;
  finished: boolean;
}

export type Game = DiceGame | RpsGame;

const rawChainGameTypeMap = (rawGameType: number): GameType => {
  switch (rawGameType) {
    case RawChainGameType.dice:
      return GameType.dice;
    case RawChainGameType.rps:
      return GameType.rps;
    default:
      throw new Error("Unknow game type");
  }
};

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
