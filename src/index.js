import "./scss/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { NeedMetamask } from "./components/NeedMetamask";
import reportWebVitals from "./reportWebVitals";

const rootDom = document.getElementById("root");
const root = ReactDOM.createRoot(rootDom);

if (!window.ethereum) {
  root.render(<NeedMetamask />);
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
