import { useContext } from "react";
import { Link } from "react-router-dom";
import { connectWallet } from "../utils";
import { WalletContext } from "../WalletContext";
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

        <ul className="navbar-nav">
          <li className="nav-item me-3">{accountInfo}</li>
          <li
            className={
              "nav-item" + (wallet.chainInfo ? " text-primary" : " text-danger")
            }
          >
            {wallet.chainInfo ? wallet.chainInfo.name : "Wrong Network"}
          </li>
        </ul>
      </div>
    </nav>
  );
}
