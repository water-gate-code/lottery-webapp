import { useParams } from "react-router-dom";
import { DicePlayGround } from "./Dice";

export function Game() {
  let { gameId } = useParams();
  return <DicePlayGround id={gameId} dice={{ diceId: gameId }} />;
}
