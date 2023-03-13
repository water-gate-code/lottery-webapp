import { useParams, Link } from "react-router-dom";

import { GameType, getGameName, CreateGameRenderer } from "../games";

const Tab = ({ isActive, type }) => {
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
  let { gameType } = useParams();

  const activeType = gameType ? parseInt(gameType) : GameType.Dice;

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
