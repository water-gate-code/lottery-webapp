import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { getGames, GAME_ICONS } from "../utils";
import { eventEmitter, Events } from "../event";
import { WalletContext } from "../WalletContext";

function Item({ game, isActive }) {
  return (
    <Link
      className={
        "list-group-item list-group-item-action" + (isActive ? " active" : "")
      }
      to={`games/${game.id}`}
    >
      <span>{GAME_ICONS[game.type]}</span>
      &nbsp;&nbsp;
      {game.betAmount} ETH on {game.player1BetNumber}
    </Link>
  );
}

function List({ games, activeGameId, loading }) {
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
      {loading ? (
        <Link className={"list-group-item list-group-item-action"}>
          Loading...
        </Link>
      ) : (
        gameItems
      )}
    </div>
  );
}

export function GameList() {
  const { chainId } = useContext(WalletContext);
  let { gameId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    function updateGames() {
      setLoading(true);
      getGames(chainId).then((games) => {
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
  }, [chainId]);

  const game = games.find((game) => game.id == gameId);
  if (gameId && (!game || !game.isActive)) {
    navigate("/");
  }

  return (
    <List
      games={games.filter((g) => g.isActive)}
      activeGameId={gameId}
      loading={loading}
    />
  );
}
