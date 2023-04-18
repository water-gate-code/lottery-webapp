import { GameType } from "../utils/casino";

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
