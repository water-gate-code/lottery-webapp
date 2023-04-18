import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../hooks";
import { selectUser } from "../store/slices/user";
import { connectWallet } from "../utils/wallet";
import { Address } from "./Address";
import { selectChain } from "../store/slices/chain";
import { GameType, getGameNameKey } from "../utils/casino";
import { GameIcon } from "./GameIcon";
// import { changeLanguage } from "../initI18next";
// import { langs } from "../langs";

export function Topbar() {
  const { gameType: gameTypeKey } = useParams();

  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;

  const accountInfo = user.authed ? (
    <>
      {user.balance !== undefined ? (
        <div className="navbar-text me-3" title={user.balance}>
          <i className="bi bi-wallet-fill me-2"></i>
          <span className="text-primary">
            {parseFloat(user.balance).toFixed(4)}
          </span>
        </div>
      ) : null}
      <div className="navbar-text me-3" title={user.address}>
        <i className="bi bi-person-fill me-2"></i>
        <Address address={user.address} />
      </div>
    </>
  ) : (
    <div className="navbar-text me-3">
      <button
        type="button"
        className="btn btn-primary button"
        onClick={connectWallet}
      >
        {t("connectWallet")}
      </button>
    </div>
  );
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="/logo-b.png"
            alt="Barsino"
            width="24"
            height="24"
            className="d-inline-block align-text-top me-2"
          />
          {t("appName")}
        </Link>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link
              className={`nav-link ${
                gameTypeKey === GameType[GameType.dice] ? "active" : ""
              }`}
              to={`/play/${GameType[GameType.dice]}`}
            >
              <GameIcon gameType={GameType.dice} />
              <span className="ms-1">{t(getGameNameKey(GameType.dice))}</span>
            </Link>
            <Link
              className={`nav-link ${
                gameTypeKey === GameType[GameType.rps] ? "active" : ""
              }`}
              to={`/play/${GameType[GameType.rps]}`}
            >
              <GameIcon gameType={GameType.rps} />
              <span className="ms-1">{t(getGameNameKey(GameType.rps))}</span>
            </Link>
          </div>
        </div>
        <div className="d-flex flex-row">
          {/* {Object.keys(langs).map((lang) => (
            <span className="navbar-text me-3" key={lang}>
              <button
                type="button"
                className="btn btn-primary button"
                onClick={changeLanguage.bind(null, lang)}
              >
                {langs[lang].displayName}
              </button>
            </span>
          ))} */}

          {accountInfo}

          {supportChain ? (
            <>
              <span className="navbar-brand me-2 pt-1">
                <img
                  src={chain.info.icon}
                  className="rounded"
                  alt={chain.info.name}
                  width="20"
                  height="20"
                />
              </span>
              <span className="navbar-text">{chain.info.name}</span>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
