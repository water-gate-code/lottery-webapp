import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./components/ErrorPage";
import { Game } from "./components/Game";
import { CreateGame } from "./components/CreateGame";
import { Layout } from "./components/Layout";

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
        path: "games/:gameId",
        element: <Game />,
      },
    ],
  },
]);
