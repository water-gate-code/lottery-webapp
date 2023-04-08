import { CreateGame as CreateGameDice } from "./Dice/CreateGame";
import { CreateGame as CreateGameRps } from "./RockPaperScissors/CreateGame";
import { Game as GameDice } from "./Dice/GameDice";
import { Game as GameRps } from "./RockPaperScissors/GameRps";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
export const isEmptyAddress = (address: string) => {
  return address.toLowerCase() === EMPTY_ADDRESS;
};

export const GameType = {
  Dice: 1,
  Rps: 2,
};

export const getGameName = (gameType: number) => {
  switch (gameType) {
    case GameType.Dice:
      return "Dice";
    case GameType.Rps:
      return "Rock Paper Scissors";
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameIcon = ({ gameType }: any) => {
  switch (gameType) {
    case GameType.Dice:
      return <i className="bi bi-dice-5-fill"></i>;
    case GameType.Rps:
      return <i className="bi bi-scissors"></i>;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const CreateGameRenderer = ({ gameType }: any) => {
  switch (gameType) {
    case GameType.Dice:
      return <CreateGameDice />;
    case GameType.Rps:
      return <CreateGameRps />;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameRenderer = ({ game }: any) => {
  switch (game.type) {
    case GameType.Dice:
      return <GameDice game={game} />;
    case GameType.Rps:
      return <GameRps game={game} />;
    default:
      throw new Error(`Invalid Game Type (type="${game.type}")`);
  }
};
