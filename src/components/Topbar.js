import { useContext } from "react";
import { Link } from "react-router-dom";
import { connectWallet } from "../utils";
import { WalletContext } from "../contexts/WalletContext";
import { Address } from "./Address";

export function Topbar() {
  const wallet = useContext(WalletContext);
  const accountInfo =
    wallet.accounts.length > 0 ? (
      <Address address={wallet.accounts[0]} />
    ) : (
      <button
        type="button"
        className="btn btn-primary button"
        onClick={connectWallet}
      >
        Connect Your Wallet
      </button>
    );
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Barsino
        </Link>
        <div>
          <span className="navbar-text me-3">{accountInfo}</span>
          <span className="navbar-text">
            {wallet.chainInfo ? wallet.chainInfo.name : null}
          </span>
        </div>
      </div>
    </nav>
  );
}
