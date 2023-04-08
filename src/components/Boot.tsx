import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

export function mountApp(mountDom: HTMLElement) {
  const root = ReactDOM.createRoot(mountDom);
  root.render(<Boot />);
}

function Boot() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  );
}
