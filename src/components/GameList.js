import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getGames } from "../utils";

export function GameList() {
  const [games, setGames] = useState([]);
  useEffect(() => {
    getGames().then((games) => setGames(games));
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
