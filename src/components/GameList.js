import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getGames } from "../utils";
import { eventEmitter, Events } from "../event";

export function GameList() {
  const [games, setGames] = useState([]);
  function updateGames() {
    getGames().then((games) => setGames(games));
  }
  useEffect(() => {
    updateGames();
    eventEmitter.subscribe(Events.CREATE_GAME, updateGames);
    return () => {
      eventEmitter.unsubscribe(Events.CREATE_GAME, updateGames);
    };
  }, []);

  const gameItems = games.map((game) => (
    <Link
      key={game.id}
      className="list-group-item list-group-item-action"
      to={`games/${game.id}`}
    >
      Game {game.id}
    </Link>
  ));

  return (
    <div className="list-group">
      <Link className="list-group-item list-group-item-action" to={`/`}>
        Create
      </Link>
      {gameItems}
    </div>
  );
}
