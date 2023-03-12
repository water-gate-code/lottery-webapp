import { useParams, Link } from "react-router-dom";

import {
  GAME_TYPES,
  DICE_GAME_TYPE,
  getGameName,
  CreateGameRenderer,
} from "../games";

const Tab = ({ text, isActive, type }) => {
  const activeClassName = isActive ? " active" : "";
  return (
    <li className="nav-item">
      <Link className={"nav-link" + activeClassName} to={`/create/${type}`}>
        {text}
      </Link>
    </li>
  );
};

export function CreateGame() {
  let { gameType } = useParams();

  const activeGameType = gameType ? parseInt(gameType) : DICE_GAME_TYPE;

  const tabs = GAME_TYPES.map((t) => (
    <Tab
      key={t}
      type={t}
      text={getGameName(t)}
      isActive={activeGameType === t}
    />
  ));

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <ul className="nav nav-tabs  justify-content-center">{tabs}</ul>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <CreateGameRenderer gameType={activeGameType} />
        </div>
      </div>
    </div>
  );
}
