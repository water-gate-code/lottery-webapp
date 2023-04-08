import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Game } from "./Game";
import { CreateGame } from "./CreateGame";
import { Result } from "./Result";
import { App } from "./App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <CreateGame />,
      },
      {
        path: "/create/:gameType",
        element: <CreateGame />,
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
