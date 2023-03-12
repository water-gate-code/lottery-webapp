import { useParams, useNavigate } from "react-router-dom";

import {
  GAME_TYPES,
  DICE_GAME_TYPE,
  getGameName,
  CreateGameRenderer,
} from "../games";

const Tab = ({ text, isActive, onClick }) => {
  function _onClick(e) {
    e.preventDefault();
    onClick && onClick();
  }
  const activeClassName = isActive ? " active" : "";
  return (
    <li className="nav-item">
      <a className={"nav-link" + activeClassName} href="#" onClick={_onClick}>
        {text}
      </a>
    </li>
  );
};

export function CreateGame() {
  let { gameType } = useParams();
  const navigate = useNavigate();

  const activeGameType = gameType ? parseInt(gameType) : DICE_GAME_TYPE;

  const tabs = GAME_TYPES.map((t) => (
    <Tab
      key={t}
      text={getGameName(t)}
      isActive={activeGameType === t}
      onClick={() => navigate(`/create/${t}`)}
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
