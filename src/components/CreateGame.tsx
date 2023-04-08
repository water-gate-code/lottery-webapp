import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { GameType, getGameName, CreateGameRenderer } from "../games";

const Tab = ({ isActive, type }: { isActive: boolean; type: number }) => {
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

  const activeType = gameType ? parseInt(gameType) : GameType.Dice;

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
            <Tab type={GameType.Dice} isActive={activeType === GameType.Dice} />
            <Tab type={GameType.Rps} isActive={activeType === GameType.Rps} />
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
