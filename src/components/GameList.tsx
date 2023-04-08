import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { GameIcon } from "../games";
import { eventEmitter, Events } from "../event";
import {
  NotificationDispatchContext,
  NotificationType,
  NOTIFICATION_ACTION_TYPES,
  createNotification,
} from "../contexts/NotificationContext";
import { useAppSelector } from "../hooks";
import { selectCasino, selectChain } from "../store/slices/chain";

function Item({ game, currencySymbol, isActive }: any) {
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
      {game.betAmount} {currencySymbol} on {game.player1BetNumber}
    </Link>
  );
}

function List({ games, currencySymbol, activeGameId }: any) {
  const gameItems = games.map((game: any) => (
    <Item
      key={game.id}
      game={game}
      currencySymbol={currencySymbol}
      isActive={game.id === activeGameId}
    />
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
  const casino = useAppSelector(selectCasino);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;
  if (!supportChain) {
    throw new Error("Invalid chain");
  }
  const currencySymbol = chain.info.nativeCurrency.symbol;
  const notificationDispatch = useContext(NotificationDispatchContext);
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [games, setGames] = useState<any>([]);

  useEffect(() => {
    function updateGames() {
      const clearLoadingNotification = dispatchLoadingNotification();
      if (casino !== null) {
        casino.getGames().then((games) => {
          setGames(games);
          clearLoadingNotification();
        });
      }

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
        payload: notification,
      });

      return () => {
        notificationDispatch({
          type: NOTIFICATION_ACTION_TYPES.REMOVE_NOTIFICATION,
          payload: notification,
        });
      };
    }

    const cancelUpdateGames = updateGames();
    return () => {
      cancelUpdateGames();
    };
  }, [casino, notificationDispatch]);

  useEffect(() => {
    function onCompleteGame(winner: string) {
      setGames((preGames: any[]) => preGames.filter((g) => g.id !== gameId));
    }
    eventEmitter.on(Events.COMPLETE_GAME, onCompleteGame);
    return () => {
      eventEmitter.removeListener(Events.COMPLETE_GAME, onCompleteGame);
    };
  }, [navigate, gameId]);

  return (
    <List
      games={games.filter((g: any) => g.isActive)}
      currencySymbol={currencySymbol}
      activeGameId={gameId}
    />
  );
}
