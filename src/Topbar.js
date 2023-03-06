import { useContext } from "react";
import { Link } from "react-router-dom";
import { connectWallet } from "./utils";
import { WalletContext } from "./WalletContext";

export function Topbar() {
  const wallet = useContext(WalletContext);
  const accountInfo =
    wallet.accounts.length > 0 ? (
      <div>{wallet.accounts[0]}</div>
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
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Barsino
        </Link>
        {accountInfo}
      </div>
    </nav>
  );
}
