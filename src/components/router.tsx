import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { App } from "./App";
import { Home } from "./Home";
import { GamePlay } from "./GamePlay";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/play/:gameType",
        element: <GamePlay />,
      },
    ],
  },
]);
