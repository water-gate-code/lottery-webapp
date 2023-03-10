import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getGames } from "../utils";
import { eventEmitter, Events } from "../event";

function Item({ game, isActive }) {
  return (
    <Link
      className={
        "list-group-item list-group-item-action" + (isActive ? " active" : "")
      }
      to={`games/${game.id}`}
    >
      {game.betAmount} ETH on {game.player1BetNumber}
    </Link>
  );
}

function List({ games, activeGameId }) {
  const gameItems = games.map((game) => (
    <Item key={game.id} game={game} isActive={game.id == activeGameId} />
  ));
  const activeClassName = !activeGameId ? " active" : "";
  return (
    <div className="list-group">
      <Link
        className={"list-group-item list-group-item-action" + activeClassName}
        to={`/`}
      >
        Create
      </Link>
      {gameItems}
    </div>
  );
}

export function GameList() {
  let { gameId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function updateGames() {
      getGames().then((games) => {
        if (
          gameId &&
          !games.filter((g) => g.isActive).find((game) => game.id == gameId)
        ) {
          navigate("/");
        }
        setGames(games);
        setLoading(false);
      });
    }
    updateGames();
    eventEmitter.subscribe(Events.CREATE_GAME, updateGames);
    eventEmitter.subscribe(Events.COMPLETE_GAME, updateGames);
    return () => {
      eventEmitter.unsubscribe(Events.CREATE_GAME, updateGames);
      eventEmitter.unsubscribe(Events.COMPLETE_GAME, updateGames);
    };
  }, [gameId]);

  if (loading) return <div>Loading...</div>;

  return <List games={games.filter((g) => g.isActive)} activeGameId={gameId} />;
}
