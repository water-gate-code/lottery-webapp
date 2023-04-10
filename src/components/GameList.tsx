import { useParams, Link } from "react-router-dom";

import { GameIcon } from "./games";
import { useAppSelector } from "../hooks";
import { selectChain } from "../store/slices/chain";
import { selectGame } from "../store/slices/game";
import { Game } from "../utils/casino";

function Item({
  game,
  currencySymbol,
  isActive,
}: {
  game: Game;
  currencySymbol: string;
  isActive: boolean;
}) {
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

function List({
  games,
  currencySymbol,
  activeGameId,
  isLoading,
}: {
  games: Game[];
  currencySymbol: string;
  activeGameId: string | undefined;
  isLoading: boolean;
}) {
  const gameItems =
    games.length > 0
      ? games.map((game: Game) => (
          <Item
            key={game.id}
            game={game}
            currencySymbol={currencySymbol}
            isActive={game.id === activeGameId}
          />
        ))
      : null;
  const activeClassName = !activeGameId ? " active" : "";
  return (
    <div className="list-group">
      <Link
        className={"list-group-item list-group-item-action" + activeClassName}
        to={`/`}
      >
        Create
      </Link>
      {!isLoading ? (
        gameItems
      ) : (
        <div className={"list-group-item list-group-item-action"}>
          <div className="d-flex justify-content-center">
            <div
              className="spinner-border spinner-border-sm m-1"
              role="status"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GameList() {
  const chain = useAppSelector(selectChain);
  const { gameList } = useAppSelector(selectGame);
  const supportChain = chain.id !== null && chain.support;
  if (!supportChain) {
    throw new Error("Invalid chain");
  }
  const currencySymbol = chain.info.nativeCurrency.symbol;
  const { gameId } = useParams();

  if (gameList.value === null) throw new Error("Invalid game list");
  return (
    <List
      games={gameList.value.filter((g: Game) => g.isActive)}
      currencySymbol={currencySymbol}
      activeGameId={gameId}
      isLoading={gameList.status === "loading"}
    />
  );
}
