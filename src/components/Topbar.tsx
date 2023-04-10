import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../hooks";
import { selectUser } from "../store/slices/user";
import { connectWallet } from "../utils/wallet";
import { Address } from "./Address";
import { selectChain } from "../store/slices/chain";

export function Topbar() {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;

  const accountInfo = user.authed ? (
    <>
      {user.balance !== undefined ? (
        <span className="navbar-text me-3" title={user.balance}>
          <i className="bi bi-wallet-fill me-2"></i>
          <span className="text-primary">
            {parseFloat(user.balance).toFixed(4)}
          </span>
        </span>
      ) : null}
      <span className="navbar-text me-3">
        <i className="bi bi-person-fill me-2"></i>
        <Address address={user.address} />
      </span>
    </>
  ) : (
    <span className="navbar-text me-3">
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

        <div>
          {accountInfo}

          {supportChain ? (
            <>
              <span className="navbar-brand me-2">
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
