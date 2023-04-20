import { useAppSelector } from "../hooks";
import { selectApp } from "../store/slices/app";
import { Topbar } from "./Topbar";
import { Notification } from "./Notification";
import { Outlet } from "react-router-dom";

export function App() {
  const { initialized } = useAppSelector(selectApp);

  if (!initialized) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  }
  return (
    <>
      <Topbar />
      <div className="container-fluid mt-3">
        <div className="row">
          <div className="col">
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
