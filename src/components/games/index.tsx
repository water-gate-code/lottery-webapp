import { CreateGame as CreateGameDice } from "./Dice/CreateGame";
import { CreateGame as CreateGameRps } from "./RockPaperScissors/CreateGame";
import { Game as GameDice } from "./Dice/GameDice";
import { Game as GameRps } from "./RockPaperScissors/GameRps";
import { Game, GameType } from "../../utils/casino";

export const GameIcon = ({ gameType }: { gameType: GameType }) => {
  switch (gameType) {
    case GameType.dice:
      return <i className="bi bi-dice-5-fill"></i>;
    case GameType.rps:
      return <i className="bi bi-scissors"></i>;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const CreateGameRenderer = ({
  gameType,
  onCreateGameSuccess,
}: {
  gameType: GameType;
  onCreateGameSuccess: (game: Game) => void;
}) => {
  switch (gameType) {
    case GameType.dice:
      return <CreateGameDice onCreateGameSuccess={onCreateGameSuccess} />;
    case GameType.rps:
      return <CreateGameRps onCreateGameSuccess={onCreateGameSuccess} />;
    default:
      throw new Error(`Invalid Game Type (type="${gameType}")`);
  }
};

export const GameRenderer = ({ game }: { game: Game }) => {
  switch (game.type) {
    case GameType.dice:
      return <GameDice game={game} />;
    case GameType.rps:
      return <GameRps game={game} />;
    default:
      throw new Error(`Invalid Game Type (type="${game.type}")`);
  }
};
