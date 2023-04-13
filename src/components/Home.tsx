import { Link } from "react-router-dom";
import { GameType, getGameNameKey } from "../utils/casino";
import { t } from "i18next";

export function Home() {
  return (
    <div>
      <div className="row justify-content-evenly">
        <div className="col-4">
          <Link to={`/play/${GameType[GameType.dice]}`}>
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">
                  {t(getGameNameKey(GameType.dice))}
                </h1>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-4">
          <Link to={`/play/${GameType[GameType.rps]}`}>
            <div className="card">
              <div className="card-body">
                <h1 className="card-title">
                  {t(getGameNameKey(GameType.rps))}
                </h1>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
