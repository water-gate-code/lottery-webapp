import { createBrowserRouter, useParams } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";
import { App } from "./App";
import { Home } from "./Home";
import { GamePlay } from "./GamePlay";
import { parseGameType } from "../utils/casino";

const GamePlayWrapper = () => {
  const { gameType: gameTypeKey } = useParams();
  if (gameTypeKey === undefined) throw new Error("Invalid game type");
  const gameType = parseGameType(gameTypeKey);
  return <GamePlay key={gameTypeKey} gameType={gameType} />;
};
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
        element: <GamePlayWrapper />,
      },
    ],
  },
]);
