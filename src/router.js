import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { Game } from "./Game";
import { NewGame } from "./NewGame";
import { Layout } from "./Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <NewGame />,
      },
      {
        path: "games/:gameId",
        element: <Game />,
      },
    ],
  },
]);
