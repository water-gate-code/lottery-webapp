import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { DICE_GAME_TYPE, ROCK_PAPER_SCISSORS_GAME_TYPE } from "../utils";
import { getGames } from "../utils";
import { Game as GameDice } from "./GameDice";
import { Game as GameRps } from "./GameRps";

const gameForms = {
  [DICE_GAME_TYPE]: <GameDice />,
  [ROCK_PAPER_SCISSORS_GAME_TYPE]: <GameRps />,
};

export function Game() {
  let { gameId } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getGames().then((games) => {
      setGame(games.find((g) => g.id == gameId));
      setLoading(false);
    });
  }, [gameId]);

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Game not found!</div>;
  return gameForms[game.type || DICE_GAME_TYPE];
}
