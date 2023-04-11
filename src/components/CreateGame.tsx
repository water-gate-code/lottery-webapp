import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CreateGameRenderer } from "./games";
import { Game, GameType, getGameNameKey, parseGameType } from "../utils/casino";

const Tab = ({ isActive, type }: { isActive: boolean; type: GameType }) => {
  const { t } = useTranslation();
  const className = `nav-link ${isActive ? "active" : ""}`;
  const gameTypeKey = GameType[type];
  return (
    <li className="nav-item">
      <Link className={className} to={`/create/${gameTypeKey}`}>
        {t(getGameNameKey(type))}
      </Link>
    </li>
  );
};

export function CreateGame() {
  const { gameType: gameTypeKey } = useParams();
  const navigate = useNavigate();

  const activeType = gameTypeKey ? parseGameType(gameTypeKey) : GameType.dice;

  function onCreateGameSuccess(game: Game) {
    navigate(`/games/${game.id}`);
  }

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
          <CreateGameRenderer
            onCreateGameSuccess={onCreateGameSuccess}
            gameType={activeType}
          />
        </div>
      </div>
    </div>
  );
}
