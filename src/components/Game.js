import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { DICE_GAME_TYPE, ROCK_PAPER_SCISSORS_GAME_TYPE } from "../utils";
import { getGame } from "../utils";
import { Game as GameDice } from "./GameDice";
import { Game as GameRps } from "./GameRps";
import { WalletContext } from "../WalletContext";

const gameForms = {
  [DICE_GAME_TYPE]: <GameDice />,
  [ROCK_PAPER_SCISSORS_GAME_TYPE]: <GameRps />,
};

export function Game() {
  let { gameId } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { chainId } = useContext(WalletContext);

  useEffect(() => {
    setLoading(true);
    getGame(chainId, gameId).then((game) => {
      setGame(game);
      setLoading(false);
    });
  }, [gameId, chainId]);

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Game not found!</div>;
  return gameForms[game.type || DICE_GAME_TYPE];
}
