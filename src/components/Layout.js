import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { WalletContext } from "../contexts/WalletContext";
import { Topbar } from "./Topbar";
import { GameList } from "./GameList";
import { WrongNetwork } from "./WrongNetwork";
import { Notification } from "./Notification";

const { ethereum } = window;

function GameScreen() {
  const { casino, chain } = useContext(WalletContext);

  useEffect(() => {
    function onCompleteGame(winner) {
      console.log(`[contract event] winner:`, winner);
      eventEmitter.dispatch(Events.COMPLETE_GAME, winner);
    }

    casino.on("CompleteGame_Event", onCompleteGame);
    return () => {
      casino.off("CompleteGame_Event", onCompleteGame);
    };
  }, [casino]);
  return (
    <>
      <Topbar />
      <div className="container-fluid mt-3" key={chain.info.chainId}>
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
      <Notification />
    </>
  );
}

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

  if (supportNetwork) {
    return <GameScreen />;
  }

  return (
    <>
      <Topbar />
      <WrongNetwork />
      <Notification />
    </>
  );
}
