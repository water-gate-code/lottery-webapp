import { useParams, useNavigate } from "react-router-dom";

import { CreateGame as CreateGameDice } from "./CreateGameDice";
import { CreateGame as CreateGameRps } from "./CreateGameRps";

import {
  GAME_TYPES,
  DICE_GAME_TYPE,
  ROCK_PAPER_SCISSORS_GAME_TYPE,
  GAME_NAMES,
} from "../utils";

const gameForms = {
  [DICE_GAME_TYPE]: <CreateGameDice />,
  [ROCK_PAPER_SCISSORS_GAME_TYPE]: <CreateGameRps />,
};

const Tab = ({ type, activeType, onClick }) => {
  function _onClick(e) {
    e.preventDefault();
    onClick && onClick(type);
  }
  const activeClassName = type == activeType ? " active" : "";
  return (
    <li className="nav-item">
      <a
        className={"nav-link" + activeClassName}
        aria-current="page"
        href="#"
        onClick={_onClick}
      >
        {GAME_NAMES[type]}
      </a>
    </li>
  );
};

export function CreateGame() {
  let { gameType } = useParams();
  const navigate = useNavigate();
  function goTo(type) {
    navigate(`/create/${type}`);
  }
  const tabs = GAME_TYPES.map((t) => (
    <Tab
      key={t}
      type={t}
      activeType={gameType || DICE_GAME_TYPE}
      onClick={goTo}
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
        <div className="col">{gameForms[gameType || DICE_GAME_TYPE]}</div>
      </div>
    </div>
  );
}
