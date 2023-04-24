import { Link } from "react-router-dom";
import { GameType } from "../utils/casino";
import { GameIcon } from "./GameIcon";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="d-flex justify-content-center mt-5">
        <img
          className="m-3"
          src="/logo-b.png"
          alt="Barsino"
          style={{ height: "auto", width: 160 }}
        />
      </div>
      <div className="text-center mb-5">
        <h6 className="display-6">{t("appIntro")}</h6>
        <div className="blockquote">{t("appSubIntro")}</div>
      </div>
      <div className="d-flex justify-content-evenly">
        <Link to={`/play/${GameType[GameType.dice]}`}>
          <div className="border h1 rounded game-large-icon d-flex align-items-center justify-content-center">
            <GameIcon gameType={GameType.dice} />
          </div>
        </Link>
        <Link to={`/play/${GameType[GameType.rps]}`}>
          <div className="border h1 rounded game-large-icon d-flex align-items-center justify-content-center">
            <GameIcon gameType={GameType.rps} />
          </div>
        </Link>
      </div>

      {/* <div className="p-5" style={{ background: "#000" }}>
        <span className="h1">Barsino</span> is a new web3 gambling app, has
        officially launched and is now available for users to experience a new
        level of online gambling. Barsino is designed to bring the fun and
        excitement of traditional casinos to the decentralized world, offering a
        secure, transparent and fair gambling experience on the blockchain.
      </div> */}
    </div>
  );
}
