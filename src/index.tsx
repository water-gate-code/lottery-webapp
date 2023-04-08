import "./scss/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { App } from "./App";
import { NeedMetamask } from "./components/NeedMetamask";
import { reportWebVitals, sendToGoogleAnalytics } from "./reportWebVitals";
import { metamaskInstalled } from "./utils/wallet";
import { store } from "./store";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

function mountApp(mountDom: HTMLElement) {
  const root = ReactDOM.createRoot(mountDom);
  if (metamaskInstalled()) {
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  } else {
    root.render(<NeedMetamask />);
  }
}

const rootDom = document.getElementById("root");
if (rootDom !== null) mountApp(rootDom);

reportWebVitals(sendToGoogleAnalytics);
