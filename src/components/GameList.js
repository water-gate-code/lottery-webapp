import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getGames } from "../utils";
import { eventEmitter, Events } from "../event";

const NULL_PLAYER = "0x0000000000000000000000000000000000000000";
const isActiveGame = (game) => game.player2.indexOf(NULL_PLAYER) == 0;

function Item({ game, isActive }) {
  return (
    <Link
      className={
        "list-group-item list-group-item-action" + (isActive ? " active" : "")
      }
      to={`games/${game.id}`}
    >
      {game.betAmount} ETH on {game.player1BetNumber < 6 ? "small" : "big"}
    </Link>
  );
}

function List({ games, gameId }) {
  const gameItems = games
    .filter(isActiveGame)
    .map((game) => (
      <Item key={game.id} game={game} isActive={game.id == gameId} />
    ));

  return <>{gameItems}</>;
}

export function GameList() {
  let { gameId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  useEffect(() => {
    function updateGames() {
      getGames().then((games) => {
        if (
          gameId &&
          !games.filter(isActiveGame).find((game) => game.id == gameId)
        ) {
          navigate("/");
        }
        setGames(games);
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

  return (
    <div className="list-group">
      <Link
        className={
          "list-group-item list-group-item-action" + (!gameId ? " active" : "")
        }
        to={`/`}
      >
        Create
      </Link>
      <List games={games} gameId={gameId} />
    </div>
  );
}
