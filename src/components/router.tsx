import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Game } from "./Game";
import { CreateGame } from "./CreateGame";
import { Result } from "./Result";
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
        path: "/create/:gameType",
        element: <CreateGame />,
      },
      {
        path: "/play/:gameType",
        element: <GamePlay />,
      },
      {
        path: "/result/:result",
        element: <Result />,
      },
      {
        path: "games/:gameId",
        element: <Game />,
      },
    ],
  },
]);
