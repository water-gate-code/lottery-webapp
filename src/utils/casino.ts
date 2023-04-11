import {
  formatEther,
  BrowserProvider,
  parseEther,
  ContractTransactionReceipt,
} from "ethers";
import { ChainConfig, chains } from "./chains";
import { Casino__factory, Casino as CasinoContract } from "./contracts";
import {
  CreateGame_EventEvent,
  CompleteGame_EventEvent,
  DisplayInfoStructOutput,
} from "./contracts/Casino";
import { TypedListener } from "./contracts/common";

const { ethereum } = window;

enum CasinoEvent {
  CompleteGame_Event = "CompleteGame_Event",
  CreateGame_Event = "CreateGame_Event",
  RandomRequestTest_Event = "RandomRequestTest_Event",
  RandomResultTest_Event = "RandomResultTest_Event",
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

export const getGameNameKey = (gameType: GameType) => {
  switch (gameType) {
    case GameType.dice:
      return "game.dice.name";
    case GameType.rps:
      return "game.rps.name";
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

const getGameType = (rawGameType: bigint): GameType => {
  const parseedRawGameType: RawChainGameType = parseInt(rawGameType.toString());
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

export const formatGame = (rawChainGame: DisplayInfoStructOutput): Game => {
  const { id, gameType, wager, gamblers } = rawChainGame;
  if (gamblers.length < 1) throw new Error("Invalid gamblers");
  const game: Game = {
    id,
    type: getGameType(gameType),
    betAmount: formatEther(wager),
    player1: gamblers[0].id,
    player1BetNumber: gamblers[0].choice.toString(),
    isActive: gamblers.length < 2,
  };
  return game;
};
export class Casino {
  #chain;
  #contract: CasinoContract;
  #signedContract: CasinoContract | undefined;
  #provider;
  constructor(chain: ChainConfig) {
    if (!chain) throw new Error("Chain is required!");
    this.#chain = chain;
    const { address } = this.#chain.contracts.Casino;
    this.#provider = new BrowserProvider(ethereum);
    this.#contract = Casino__factory.connect(address, this.#provider);
  }

  onCreateGame(callback: TypedListener<CreateGame_EventEvent.Event>) {
    const event = this.#contract.getEvent(CasinoEvent.CreateGame_Event);
    this.#contract.on(event, callback);
  }
  offCreateGame(callback: TypedListener<CreateGame_EventEvent.Event>) {
    const event = this.#contract.getEvent(CasinoEvent.CreateGame_Event);
    this.#contract.off(event, callback);
  }

  onCompleteGame(callback: TypedListener<CompleteGame_EventEvent.Event>) {
    const event = this.#contract.getEvent(CasinoEvent.CompleteGame_Event);
    this.#contract.on(event, callback);
  }
  offCompleteGame(callback: TypedListener<CompleteGame_EventEvent.Event>) {
    const event = this.#contract.getEvent(CasinoEvent.CompleteGame_Event);
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
    if (this.#signedContract === undefined) {
      const signer = await this.#provider.getSigner();
      const { address } = this.#chain.contracts.Casino;

      this.#signedContract = Casino__factory.connect(address, signer);
    }
    return this.#signedContract;
  }
  async createGame(amount: string, gameType: GameType, choice: number) {
    const contract = await this.signedContract();

    const type = getRawGameType(gameType);
    const value = parseEther(amount);

    const response = await contract.createGame(type, choice, {
      value,
    });
    const receipt = await response.wait();
    if (receipt === null) throw new Error("Receipt is null");

    let createGameEvent = null;
    for (const log of receipt.logs || []) {
      if (log !== null) {
        const parsedLog = contract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        } as { topics: Array<string>; data: string });
        if (parsedLog !== null) {
          const eventName = parsedLog.name;
          if (eventName === CasinoEvent.CreateGame_Event) {
            createGameEvent = parsedLog;
          }
        }
      }
    }
    if (!createGameEvent) throw new Error("Create game event not found");
    return formatGame(createGameEvent.args.game);
  }
  async playGame(amount: string, gameId: string, choice: number) {
    const contract = await this.signedContract();
    const value = parseEther(amount);
    const response = await contract.playGame(gameId, choice, {
      value,
    });

    return await response.wait();
  }
  parseWinnerFromEvent(receipt: ContractTransactionReceipt | null) {
    if (receipt === null) throw new Error("Receipt is null");

    let completeGameEvent = null;
    for (const log of receipt.logs || []) {
      if (log !== null) {
        const parsedLog = this.#contract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        } as { topics: Array<string>; data: string });
        if (parsedLog !== null) {
          const eventName = parsedLog.name;
          if (eventName === CasinoEvent.CompleteGame_Event) {
            completeGameEvent = parsedLog;
          }
        }
      }
    }
    if (!completeGameEvent) throw new Error("Create game event not found");
    return formatGame(completeGameEvent.args.winner);
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
