import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { GameList } from "./GameList";

export function Layout() {
  return (
    <div>
      <Topbar />
      <div className="row">
        <div className="col-3">
          <GameList />
        </div>
        <div className="col-9">
          <div className="App container">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
