import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { GameIcon, getGames } from "../games";
import { eventEmitter, Events } from "../event";
import { WalletContext } from "../contexts/WalletContext";
import {
  NotificationDispatchContext,
  NotificationType,
  NOTIFICATION_ACTION_TYPES,
  createNotification,
} from "../contexts/NotificationContext";

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

function List({ games, activeGameId }) {
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
      {gameItems}
    </div>
  );
}

export function GameList() {
  const { chainId } = useContext(WalletContext);
  const notificationDispatch = useContext(NotificationDispatchContext);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function updateGames() {
      setLoading(true);
      const clearLoadingNotification = dispatchLoadingNotification();
      const stopLoading = () => {
        setLoading(false);
        clearLoadingNotification();
      };

      getGames(chainId).then((games) => {
        setGames(games);
        stopLoading();
      });

      // this cancel not realy cancel the request, but just cancel the display loading
      return () => stopLoading();
    }
    function dispatchLoadingNotification() {
      const notification = createNotification(
        NotificationType.info,
        "Loading Games..."
      );
      notificationDispatch({
        type: NOTIFICATION_ACTION_TYPES.ADD_NOTIFICATION,
        notification,
      });

      return () => {
        notificationDispatch({
          type: NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION,
          id: notification.id,
        });
      };
    }
    const cancelUpdateGames = updateGames();
    eventEmitter.on(Events.CREATE_GAME, updateGames);
    eventEmitter.on(Events.COMPLETE_GAME, updateGames);
    return () => {
      eventEmitter.removeListener(Events.CREATE_GAME, updateGames);
      eventEmitter.removeListener(Events.COMPLETE_GAME, updateGames);
      cancelUpdateGames();
    };
  }, [chainId, notificationDispatch]);

  useEffect(() => {
    const game = games.find((game) => game.id === gameId);
    if (gameId && !loading && (!game || !game.isActive)) {
      return navigate("/");
    }
  });

  return <List games={games.filter((g) => g.isActive)} activeGameId={gameId} />;
}
