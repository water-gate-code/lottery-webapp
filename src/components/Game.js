import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { GameRenderer } from "../games";
import { WalletContext } from "../contexts/WalletContext";

export function Game() {
  const { gameId } = useParams();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { casino } = useContext(WalletContext);

  useEffect(() => {
    setLoading(true);
    casino.getGame(gameId).then((game) => {
      setGame(game);
      setLoading(false);
    });
  }, [gameId, casino]);

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Game not found!</div>;
  return <GameRenderer game={game} />;
}
