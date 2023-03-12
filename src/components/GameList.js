import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { GameIcon, getGames } from "../games";
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
      <span>
        <GameIcon gameType={game.type} />
      </span>
      &nbsp;&nbsp;
      {game.betAmount} ETH on {game.player1BetNumber}
    </Link>
  );
}

function List({ games, activeGameId, loading }) {
  const gameItems = games.map((game) => (
    <Item key={game.id} game={game} isActive={game.id === activeGameId} />
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
    eventEmitter.on(Events.CREATE_GAME, updateGames);
    eventEmitter.on(Events.COMPLETE_GAME, updateGames);
    return () => {
      eventEmitter.removeListener(Events.CREATE_GAME, updateGames);
      eventEmitter.removeListener(Events.COMPLETE_GAME, updateGames);
    };
  }, [chainId]);

  useEffect(() => {
    const game = games.find((game) => game.id === gameId);
    if (gameId && (!game || !game.isActive)) {
      return navigate("/");
    }
  });

  return (
    <List
      games={games.filter((g) => g.isActive)}
      activeGameId={gameId}
      loading={loading}
    />
  );
}
