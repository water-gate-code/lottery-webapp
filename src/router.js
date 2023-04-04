import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./components/ErrorPage";
import { Game } from "./components/Game";
import { CreateGame } from "./components/CreateGame";
import { Layout } from "./components/Layout";
import { Result } from "./components/Result";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
