import { CreateGame as CreateGameDice } from "./Dice/CreateGame";
import { CreateGame as CreateGameRps } from "./RockPaperScissors/CreateGame";
import { Game as GameDice } from "./Dice/GameDice";
import { Game as GameRps } from "./RockPaperScissors/GameRps";
import { GameType } from "../utils/casino";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
export const isEmptyAddress = (address: string) => {
  return address.toLowerCase() === EMPTY_ADDRESS;
};

export const GameIcon = ({ gameType }: any) => {
  switch (gameType) {
    case GameType.dice:
      return <i className="bi bi-dice-5-fill"></i>;
    case GameType.rps:
      return <i className="bi bi-scissors"></i>;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const CreateGameRenderer = ({ gameType }: { gameType: GameType }) => {
  switch (gameType) {
    case GameType.dice:
      return <CreateGameDice />;
    case GameType.rps:
      return <CreateGameRps />;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameRenderer = ({ game }: any) => {
  switch (game.type) {
    case GameType.dice:
      return <GameDice game={game} />;
    case GameType.rps:
      return <GameRps game={game} />;
    default:
      throw new Error(`Invalid Game Type (type="${game.type}")`);
  }
};
