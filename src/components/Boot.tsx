import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import { store } from "../store";
import { router } from "./router";

export function mountApp(mountDom: HTMLElement) {
  const root = createRoot(mountDom);
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
