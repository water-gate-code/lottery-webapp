import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { GameRenderer, isEmptyAddress } from "../games";
import { WalletContext } from "../contexts/WalletContext";
import { eventEmitter, Events } from "../event";

export function Game() {
  const { gameId } = useParams();
  const { accounts, casino } = useContext(WalletContext);
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    casino.getGame(gameId).then((game) => {
      setGame(game);
      setLoading(false);
    });
  }, [gameId, casino]);

  useEffect(() => {
    function onCompleteGame(winner) {
      const equal = (address) => address.toLowerCase() === winner.toLowerCase();
      const result = isEmptyAddress(winner) ? 0 : accounts.find(equal) ? 1 : -1;
      navigate(`/result/${result > 0 ? "win" : result < 0 ? "lose" : "equal"}`);
    }
    eventEmitter.on(Events.COMPLETE_GAME, onCompleteGame);
    return () => {
      eventEmitter.removeListener(Events.COMPLETE_GAME, onCompleteGame);
    };
  }, [navigate, accounts]);

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Game not found!</div>;
  return <GameRenderer game={game} />;
}
