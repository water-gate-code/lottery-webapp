import "./scss/custom.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";
import { NeedMetamask } from "./components/NeedMetamask";
import reportWebVitals from "./reportWebVitals";

const rootDom = document.getElementById("root");
const root = ReactDOM.createRoot(rootDom);

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

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
reportWebVitals(sendToGoogleAnalytics);

function sendToGoogleAnalytics({ name, delta, value, id }) {
  // Assumes the global `gtag()` function exists, see:
  // https://developers.google.com/analytics/devguides/collection/ga4
  window.gtag("event", name, {
    // Built-in params:
    value: delta, // Use `delta` so the value can be summed.
    // Custom params:
    metric_id: id, // Needed to aggregate events.
    metric_value: value, // Optional.
    metric_delta: delta, // Optional.

    // OPTIONAL: any additional params or debug info here.
    // See: https://web.dev/debug-performance-in-the-field/
    // metric_rating: 'good' | 'needs-improvement' | 'poor',
    // debug_info: '...',
    // ...
  });
}
