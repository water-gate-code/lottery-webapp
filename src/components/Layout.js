import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { WalletContext } from "../contexts/WalletContext";
import { Topbar } from "./Topbar";
import { GameList } from "./GameList";
import { WrongNetwork } from "./WrongNetwork";
import { Notification } from "./Notification";

export function Layout() {
  const wallet = useContext(WalletContext);
  const supportNetwork = !!wallet.chainInfo;
  return (
    <>
      <Topbar />
      {supportNetwork ? (
        <div className="container-fluid mt-3">
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
