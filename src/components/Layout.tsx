import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { eventEmitter, Events } from "../event";
import { Topbar } from "./Topbar";
import { GameList } from "./GameList";
import { WrongNetwork } from "./WrongNetwork";
import { Notification } from "./Notification";
import { useAppSelector } from "../hooks";
import { selectCasino, selectChain } from "../store/slices/chain";

function GameScreen() {
  return (
    <>
      <Topbar />
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
      <Notification />
    </>
  );
}

export function Layout() {
  const chain = useAppSelector(selectChain);
  const casino = useAppSelector(selectCasino);
  const supportNetwork = chain.id !== null && chain.support;

  useEffect(() => {
    function onCompleteGame(winner: string) {
      console.log(`[contract event] winner:`, winner);
      eventEmitter.dispatch(Events.COMPLETE_GAME, winner);
    }
    if (casino !== null) {
      casino.on("CompleteGame_Event", onCompleteGame);
      return () => {
        casino.off("CompleteGame_Event", onCompleteGame);
      };
    }
  }, [casino]);

  if (supportNetwork && casino != null) {
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
