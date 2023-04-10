import { formatEther, BrowserProvider, parseEther } from "ethers";
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
  const {id, host, gameType, wager, isActive, gamblers} = rawChainGame;

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
  async createGame(amount: number, gameType: GameType, bet: number) {
    const signedContract = await this.signedContract();

    const response = await signedContract?.playGameWithDefaultHost(
      getRawGameType(gameType),
      bet,
      {
        value: parseEther(amount.toString()),
      }
    );
    const receipt = await response.wait();
    if (receipt === null) throw new Error("Receipt is null");

    let createGameEvent = null;
    for (const log of receipt.logs || []) {
      if (log !== null) {
        const parsedLog = signedContract.interface.parseLog({
          topics: log.topics,
          data: log.data,
        } as any);
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
      (e: any) => e.event === CasinoEvent.CompleteGame_Event
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
