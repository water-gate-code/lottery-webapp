import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../hooks";
import { selectUser } from "../store/slices/user";
import { connectWallet } from "../utils/wallet";
import { Address } from "./Address";
import { selectChain } from "../store/slices/chain";
import { GameType, getGameNameKey } from "../utils/casino";
import { GameIcon } from "./GameIcon";
import { selectApp } from "../store/slices/app";
import { InstallMetamaskBtn } from "./InstallMetamaskBtn";
// import { changeLanguage } from "../initI18next";
// import { langs } from "../langs";

const DISCORD_INVITE_LINK = "https://discord.gg/S2q73aMh6M";

export function Topbar() {
  const { gameType: gameTypeKey } = useParams();

  const { t } = useTranslation();
  const { metamaskInstalled } = useAppSelector(selectApp);
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;

  const accountInfo = user.authed ? (
    <>
      {user.balance !== undefined ? (
        <span className="nav-link" title={user.balance}>
          <i className="bi bi-wallet-fill me-1"></i>
          <span className="text-primary">
            {parseFloat(user.balance).toFixed(4)}
          </span>
        </span>
      ) : null}
      <span className="nav-link" title={user.address}>
        <i className="bi bi-person-fill me-1"></i>
        <Address address={user.address} />
      </span>
    </>
  ) : (
    <span>
      <button
        type="button"
        className="btn btn-primary button"
        onClick={connectWallet}
      >
        {t("connectWallet")}
      </button>
    </span>
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
        <div className="navbar-nav">
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

          {metamaskInstalled ? accountInfo : <InstallMetamaskBtn />}

          {supportChain ? (
            <span className="nav-link" title={chain.info.name}>
              <img
                src={chain.info.icon}
                className="rounded me-1"
                style={{ marginTop: "-0.2rem" }}
                alt={chain.info.name}
                width="20"
                height="20"
              />
              <span>{chain.info.name}</span>
            </span>
          ) : null}
          <a
            className="nav-link"
            title="Contact Us"
            href={DISCORD_INVITE_LINK}
            rel="noreferrer"
            target="_blank"
          >
            <i className="bi bi-chat-dots-fill me-1"></i>
            <span className="text-primary">Contact Us</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
