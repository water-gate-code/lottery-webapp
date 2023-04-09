import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { CreateGameRenderer } from "../games";
import { GameType, getGameName, parseGameType } from "../utils/casino";

const Tab = ({ isActive, type }: { isActive: boolean; type: GameType }) => {
  const className = `nav-link ${isActive ? "active" : ""}`;
  return (
    <li className="nav-item">
      <Link className={className} to={`/create/${type}`}>
        {getGameName(type)}
      </Link>
    </li>
  );
};

export function CreateGame() {
  const { gameType } = useParams();
  const navigate = useNavigate();

  const activeType = gameType ? parseGameType(gameType) : GameType.dice;

  useEffect(() => {
    function onCreateGame(game: any) {
      navigate(`/games/${game.id}`);
    }
    eventEmitter.on(Events.CREATE_GAME, onCreateGame);
    return () => {
      eventEmitter.removeListener(Events.CREATE_GAME, onCreateGame);
    };
  }, [navigate]);
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <ul className="nav nav-tabs  justify-content-center">
            <Tab type={GameType.dice} isActive={activeType === GameType.dice} />
            <Tab type={GameType.rps} isActive={activeType === GameType.rps} />
          </ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <CreateGameRenderer gameType={activeType} />
        </div>
      </div>
    </div>
  );
}
