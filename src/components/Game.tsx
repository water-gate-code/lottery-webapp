import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { GameRenderer, isEmptyAddress } from "../games";
import { eventEmitter, Events } from "../event";
import { useAppSelector } from "../hooks";
import { selectCasino } from "../store/slices/chain";
import { selectUser } from "../store/slices/user";

export function Game() {
  const { gameId } = useParams();
  const casino = useAppSelector(selectCasino);
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (casino !== null && gameId !== undefined) {
      casino.getGame(gameId).then((game) => {
        setGame(game);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [gameId, casino]);

  useEffect(() => {
    function onCompleteGame(winner: string) {
      const isWinner = (address: string) =>
        address.toLowerCase() === winner.toLowerCase();
      const result = isEmptyAddress(winner)
        ? 0
        : user.authed && isWinner(user.address)
        ? 1
        : -1;
      navigate(`/result/${result > 0 ? "win" : result < 0 ? "lose" : "equal"}`);
    }
    eventEmitter.on(Events.COMPLETE_GAME, onCompleteGame);
    return () => {
      eventEmitter.removeListener(Events.COMPLETE_GAME, onCompleteGame);
    };
  }, [navigate, user]);

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  if (!game) return <div>Game not found!</div>;
  return <GameRenderer game={game} />;
}
