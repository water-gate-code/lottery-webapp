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
  const { chainId, accounts } = useContext(WalletContext);
  const notificationDispatch = useContext(NotificationDispatchContext);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);

  useEffect(() => {
    function updateGames() {
      const clearLoadingNotification = dispatchLoadingNotification();

      getGames(chainId).then((games) => {
        setGames(games);
        clearLoadingNotification();
      });

      // this cancel not realy cancel the request, but just cancel the display loading
      return () => clearLoadingNotification();
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
    return () => {
      cancelUpdateGames();
    };
  }, [chainId, notificationDispatch]);

  useEffect(() => {
    function onCreateGame(game) {
      setGames((preGames) => [game, ...preGames]);
      navigate(`/games/${game.id}`);
    }
    eventEmitter.on(Events.CREATE_GAME, onCreateGame);
    return () => {
      eventEmitter.removeListener(Events.CREATE_GAME, onCreateGame);
    };
  }, [navigate]);

  useEffect(() => {
    function onCompleteGame(winner) {
      const isWinner = accounts.find(
        (a) => a.toLowerCase() === winner.toLowerCase()
      );
      setGames((preGames) => preGames.filter((g) => g.id !== gameId));
      navigate(`/result/${isWinner ? "win" : "lose"}`);
    }
    eventEmitter.on(Events.COMPLETE_GAME, onCompleteGame);
    return () => {
      eventEmitter.removeListener(Events.COMPLETE_GAME, onCompleteGame);
    };
  }, [navigate, accounts, gameId]);

  return <List games={games.filter((g) => g.isActive)} activeGameId={gameId} />;
}
