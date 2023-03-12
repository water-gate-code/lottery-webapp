import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { getGame, DICE_GAME_TYPE, GameRenderer } from "../games";
import { WalletContext } from "../WalletContext";

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
  return <GameRenderer game={game} />;
}
