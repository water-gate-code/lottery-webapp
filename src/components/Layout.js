import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { WalletContext } from "../contexts/WalletContext";
import { Topbar } from "./Topbar";
import { GameList } from "./GameList";
import { WrongNetwork } from "./WrongNetwork";
import { Notification } from "./Notification";

const { ethereum } = window;

export function Layout() {
  const wallet = useContext(WalletContext);
  const navigate = useNavigate();
  const supportNetwork = !!wallet.chain;

  useEffect(() => {
    const onChainChanged = () => navigate("/");
    ethereum.on("chainChanged", onChainChanged);
    return () => {
      ethereum.removeListener("chainChanged", onChainChanged);
    };
  }, [navigate]);

  return (
    <>
      <Topbar />
      {supportNetwork ? (
        <div className="container-fluid mt-3" key={wallet.chain.info.chainId}>
          <div className="row">
            <div className="col-2">
              <GameList />
            </div>
            <div className="col-10">
              <div className="App container">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <WrongNetwork />
      )}
      <Notification />
    </>
  );
}
