import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { GameIcon } from "../games";
import { eventEmitter, Events } from "../event";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectCasino, selectChain } from "../store/slices/chain";
import {
  clearNotify,
  newNotification,
  NotificationType,
  notify,
} from "../store/slices/app";

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
  const dispatch = useAppDispatch();
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
      } else {
        clearLoadingNotification();
      }

      // this cancel not realy cancel the request, but just cancel the display loading
      return () => clearLoadingNotification();
    }
    function dispatchLoadingNotification() {
      const notification = newNotification(
        NotificationType.info,
        "Loading Games..."
      );
      dispatch(notify(notification));

      return () => dispatch(clearNotify(notification));
    }

    const cancelUpdateGames = updateGames();
    return () => {
      cancelUpdateGames();
    };
  }, [casino, dispatch]);

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
