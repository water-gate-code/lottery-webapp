import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { GameList } from "./GameList";

export function Layout() {
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
    </>
  );
}
