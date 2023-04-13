import { useAppSelector } from "../hooks";
import { selectApp } from "../store/slices/app";
import { selectChain } from "../store/slices/chain";
import { NeedMetamask } from "./NeedMetamask";
import { Topbar } from "./Topbar";
import { WrongNetwork } from "./WrongNetwork";
import { Notification } from "./Notification";
import { Outlet } from "react-router-dom";

export function App() {
  const { metamaskInstalled, initialized } = useAppSelector(selectApp);
  const chain = useAppSelector(selectChain);
  const supportChain = chain.id !== null && chain.support;

  if (!metamaskInstalled) {
    return <NeedMetamask />;
  }
  if (!initialized) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary m-5" role="status"></div>
      </div>
    );
  }
  if (!supportChain) {
    return (
      <>
        <Topbar />
        <WrongNetwork />
        <Notification />
      </>
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
