import { useContext } from "react";
import { Link } from "react-router-dom";
import { connectWallet } from "../utils";
import { WalletContext } from "../contexts/WalletContext";
import { Address } from "./Address";

export function Topbar() {
  const wallet = useContext(WalletContext);
  const accountInfo =
    wallet.accounts.length > 0 ? (
      <>
        <span
          className="navbar-text me-3"
          title={wallet.balance[wallet.accounts[0]].toString()}
        >
          <i className="bi bi-wallet-fill me-2"></i>
          <span
            className="text-primary"
            title={wallet.balance[wallet.accounts[0]].toString()}
          >
            {parseFloat(wallet.balance[wallet.accounts[0]].toString()).toFixed(
              4
            )}
          </span>
        </span>
        <span className="navbar-text me-3">
          <i className="bi bi-person-fill me-2"></i>
          <Address address={wallet.accounts[0]} />
        </span>
      </>
    ) : (
      <span className="navbar-text me-3">
        <button
          type="button"
          className="btn btn-primary button"
          onClick={connectWallet}
        >
          Connect Your Wallet
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
          Barsino
        </Link>

        <div>
          {accountInfo}

          {wallet.chain ? (
            <>
              <span className="navbar-brand me-2">
                <img
                  src={wallet.chain.info.icon}
                  className="rounded"
                  alt={wallet.chain.info.name}
                  width="20"
                  height="20"
                />
              </span>
              <span className="navbar-text">{wallet.chain.info.name}</span>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
