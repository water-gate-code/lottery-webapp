import { Link } from "react-router-dom";

import { useAppSelector } from "../hooks";
import { selectUser } from "../store/slices/user";
import { connectWallet } from "../utils";
import { Address } from "./Address";
import { selectChain } from "../store/slices/chain";

export function Topbar() {
  const user = useAppSelector(selectUser);
  const chain = useAppSelector(selectChain);

  const accountInfo = user.authed ? (
    <>
      <span className="navbar-text me-3" title={user.balance.toString()}>
        <i className="bi bi-wallet-fill me-2"></i>
        <span className="text-primary">
          {parseFloat(user.balance).toFixed(4)}
        </span>
      </span>
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

          {chain.id !== null && chain.support ? (
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
